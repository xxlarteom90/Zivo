using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Orders;
using DeliveryApp.Domain.Entities;
using DeliveryApp.Domain.Enums;
using DeliveryApp.Domain.Services;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Application.Services;

public sealed class OrderService : IOrderService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IUserContext _userContext;
    private readonly IDateTimeProvider _dateTimeProvider;

    public OrderService(
        IApplicationDbContext dbContext,
        IUserContext userContext,
        IDateTimeProvider dateTimeProvider)
    {
        _dbContext = dbContext;
        _userContext = userContext;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<PagedResponse<OrderListItemDto>> GetOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default)
    {
        var baseQuery = _dbContext.Orders.AsNoTracking()
            .WithOrderGraph()
            .ApplyFilters(query);

        var totalCount = await baseQuery.CountAsync(cancellationToken);
        var orders = await baseQuery
            .ApplySorting(query)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResponse<OrderListItemDto>
        {
            Items = orders.Select(order => order.ToListItemDto()).ToArray(),
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<OrderDetailsDto> GetOrderByIdAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var order = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);
        return order.ToDetailsDto(GetAvailableActions(order));
    }

    public async Task<OrderDetailsDto> CreateOrderAsync(CreateOrderRequestDto request, CancellationToken cancellationToken = default)
    {
        var errors = ValidateCreateOrderRequest(request);
        ValidationHelper.EnsureNoErrors(errors);

        var partnerExists = await _dbContext.PartnerBusinesses
            .AnyAsync(partner => partner.Id == request.PartnerBusinessId && partner.IsActive, cancellationToken);
        if (!partnerExists)
        {
            throw new NotFoundAppException("Partner business", request.PartnerBusinessId);
        }

        var customerExists = await _dbContext.Customers
            .AnyAsync(customer => customer.Id == request.CustomerId, cancellationToken);
        if (!customerExists)
        {
            throw new NotFoundAppException("Customer", request.CustomerId);
        }

        var pickupAddress = CreateAddress(request.PickupAddress);
        var deliveryAddress = CreateAddress(request.DeliveryAddress);
        var now = _dateTimeProvider.UtcNow;

        var order = new Order
        {
            PublicOrderNumber = GeneratePublicOrderNumber(now),
            PartnerBusinessId = request.PartnerBusinessId,
            CustomerId = request.CustomerId,
            PickupAddress = pickupAddress,
            DeliveryAddress = deliveryAddress,
            Status = OrderStatus.Available,
            PickupWindowStartUtc = request.PickupWindowStartUtc,
            PickupWindowEndUtc = request.PickupWindowEndUtc,
            DeliveryWindowStartUtc = request.DeliveryWindowStartUtc,
            DeliveryWindowEndUtc = request.DeliveryWindowEndUtc,
            Notes = request.Notes?.Trim(),
            SpecialInstructions = request.SpecialInstructions?.Trim(),
            CreatedByUserId = _userContext.UserId,
            CreatedAtUtc = now,
            Items = request.Items.Select(item => new OrderItem
            {
                ItemType = Enum.Parse<OrderItemType>(item.ItemType, ignoreCase: true),
                Description = item.Description.Trim(),
                Quantity = item.Quantity,
                EstimatedWeightKg = item.EstimatedWeightKg,
                Notes = item.Notes?.Trim()
            }).ToList(),
            StatusHistory = new List<OrderStatusHistory>
            {
                new()
                {
                    FromStatus = null,
                    ToStatus = OrderStatus.Available,
                    ChangedByUserId = _userContext.UserId,
                    ChangedAtUtc = now,
                    Reason = "Order created"
                }
            }
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var created = await LoadOrderAsync(order.Id, asTracking: false, cancellationToken);
        return created.ToDetailsDto(GetAvailableActions(created));
    }

    public async Task<OrderDetailsDto> UpdateOrderAsync(Guid orderId, UpdateOrderRequestDto request, CancellationToken cancellationToken = default)
    {
        var order = await LoadOrderAsync(orderId, asTracking: true, cancellationToken);

        if (order.Status == OrderStatus.Delivered || order.Status == OrderStatus.Cancelled)
        {
            throw new ConflictAppException($"Order {order.PublicOrderNumber} cannot be modified in status {order.Status}.");
        }

        if (request.PartnerBusinessId.HasValue && request.PartnerBusinessId.Value != Guid.Empty && request.PartnerBusinessId.Value != order.PartnerBusinessId)
        {
            var partnerExists = await _dbContext.PartnerBusinesses
                .AnyAsync(p => p.Id == request.PartnerBusinessId.Value && p.IsActive, cancellationToken);
            if (!partnerExists) throw new NotFoundAppException("Partner business", request.PartnerBusinessId.Value);
            order.PartnerBusinessId = request.PartnerBusinessId.Value;
        }

        if (request.CustomerId.HasValue && request.CustomerId.Value != Guid.Empty && request.CustomerId.Value != order.CustomerId)
        {
            var customerExists = await _dbContext.Customers.AnyAsync(c => c.Id == request.CustomerId.Value, cancellationToken);
            if (!customerExists) throw new NotFoundAppException("Customer", request.CustomerId.Value);
            order.CustomerId = request.CustomerId.Value;
        }

        if (request.PickupAddress is not null)
        {
            order.PickupAddress = CreateAddress(request.PickupAddress);
        }

        if (request.DeliveryAddress is not null)
        {
            order.DeliveryAddress = CreateAddress(request.DeliveryAddress);
        }

        if (request.PickupWindowStartUtc.HasValue) order.PickupWindowStartUtc = request.PickupWindowStartUtc;
        if (request.PickupWindowEndUtc.HasValue) order.PickupWindowEndUtc = request.PickupWindowEndUtc;
        if (request.DeliveryWindowStartUtc.HasValue) order.DeliveryWindowStartUtc = request.DeliveryWindowStartUtc;
        if (request.DeliveryWindowEndUtc.HasValue) order.DeliveryWindowEndUtc = request.DeliveryWindowEndUtc;
        if (request.Notes is not null) order.Notes = request.Notes.Trim();
        if (request.SpecialInstructions is not null) order.SpecialInstructions = request.SpecialInstructions.Trim();

        if (order.PickupWindowStartUtc.HasValue && order.PickupWindowEndUtc.HasValue && order.PickupWindowEndUtc <= order.PickupWindowStartUtc)
            throw new ValidationAppException("Invalid pickup window.", ["PickupWindowEndUtc must be after PickupWindowStartUtc."]);
        if (order.DeliveryWindowStartUtc.HasValue && order.DeliveryWindowEndUtc.HasValue && order.DeliveryWindowEndUtc <= order.DeliveryWindowStartUtc)
            throw new ValidationAppException("Invalid delivery window.", ["DeliveryWindowEndUtc must be after DeliveryWindowStartUtc."]);

        order.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        var updated = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);
        return updated.ToDetailsDto(GetAvailableActions(updated));
    }

    public async Task<OrderDetailsDto> CancelOrderAsync(Guid orderId, CancelOrderRequestDto request, CancellationToken cancellationToken = default)
    {
        var order = await LoadOrderAsync(orderId, asTracking: true, cancellationToken);

        if (!OrderStatusTransitionPolicy.CanTransition(order.Status, OrderStatus.Cancelled))
        {
            throw new ConflictAppException($"Order {order.PublicOrderNumber} cannot be cancelled from status {order.Status}.");
        }

        var now = _dateTimeProvider.UtcNow;
        var fromStatus = order.Status;
        order.Status = OrderStatus.Cancelled;
        order.CancelledAtUtc = now;

        foreach (var assignment in order.Assignments.Where(assignment => assignment.IsActive))
        {
            assignment.IsActive = false;
            assignment.CancelledAtUtc = now;
        }

        _dbContext.OrderStatusHistory.Add(new OrderStatusHistory
        {
            OrderId = order.Id,
            FromStatus = fromStatus,
            ToStatus = OrderStatus.Cancelled,
            ChangedByUserId = _userContext.UserId,
            ChangedAtUtc = now,
            Reason = string.IsNullOrWhiteSpace(request.Reason) ? "Cancelled by dispatcher" : request.Reason.Trim(),
            Notes = request.Notes?.Trim()
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
        var updated = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);
        return updated.ToDetailsDto(GetAvailableActions(updated));
    }

    private async Task<Order> LoadOrderAsync(Guid orderId, bool asTracking, CancellationToken cancellationToken)
    {
        var query = _dbContext.Orders.WithOrderGraph();
        if (!asTracking)
        {
            query = query.AsNoTracking();
        }

        return await query.SingleOrDefaultAsync(order => order.Id == orderId, cancellationToken)
            ?? throw new NotFoundAppException("Order", orderId);
    }

    private IReadOnlyCollection<string> GetAvailableActions(Order order)
    {
        var actions = new List<string>();
        if ((_userContext.IsInRole(ApiRoles.Admin) || _userContext.IsInRole(ApiRoles.Dispatcher)) &&
            OrderStatusTransitionPolicy.CanTransition(order.Status, OrderStatus.Cancelled))
        {
            actions.Add("Cancel");
        }

        return actions;
    }

    private static Address CreateAddress(CreateAddressDto dto) => new()
    {
        Line1 = dto.Line1.Trim(),
        Line2 = dto.Line2?.Trim(),
        City = dto.City.Trim(),
        CountyOrRegion = dto.CountyOrRegion?.Trim(),
        PostalCode = dto.PostalCode?.Trim(),
        Country = dto.Country.Trim(),
        Latitude = dto.Latitude,
        Longitude = dto.Longitude
    };

    private static IReadOnlyCollection<string> ValidateCreateOrderRequest(CreateOrderRequestDto request)
    {
        var errors = new List<string>();
        if (request.PartnerBusinessId == Guid.Empty) errors.Add("PartnerBusinessId is required.");
        if (request.CustomerId == Guid.Empty) errors.Add("CustomerId is required.");
        if (request.PickupAddress is null) errors.Add("PickupAddress is required.");
        if (request.DeliveryAddress is null) errors.Add("DeliveryAddress is required.");
        if (request.PickupWindowStartUtc.HasValue && request.PickupWindowEndUtc.HasValue && request.PickupWindowEndUtc <= request.PickupWindowStartUtc)
            errors.Add("PickupWindowEndUtc must be after PickupWindowStartUtc.");
        if (request.DeliveryWindowStartUtc.HasValue && request.DeliveryWindowEndUtc.HasValue && request.DeliveryWindowEndUtc <= request.DeliveryWindowStartUtc)
            errors.Add("DeliveryWindowEndUtc must be after DeliveryWindowStartUtc.");
        if (request.Items.Count == 0) errors.Add("At least one order item is required.");

        foreach (var item in request.Items)
        {
            if (!Enum.TryParse<OrderItemType>(item.ItemType, true, out _))
                errors.Add($"Invalid order item type '{item.ItemType}'.");
            if (string.IsNullOrWhiteSpace(item.Description))
                errors.Add("Order item description is required.");
            if (item.Quantity <= 0)
                errors.Add("Order item quantity must be greater than zero.");
        }

        return errors;
    }

    private static string GeneratePublicOrderNumber(DateTime now) =>
        $"ORD-{now:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
}
