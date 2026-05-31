using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Orders;
using DeliveryApp.Domain.Entities;
using DeliveryApp.Domain.Enums;
using DeliveryApp.Domain.Services;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Application.Services;

public sealed class DriverOrderService : IDriverOrderService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IUserContext _userContext;
    private readonly IDateTimeProvider _dateTimeProvider;

    public DriverOrderService(
        IApplicationDbContext dbContext,
        IUserContext userContext,
        IDateTimeProvider dateTimeProvider)
    {
        _dbContext = dbContext;
        _userContext = userContext;
        _dateTimeProvider = dateTimeProvider;
    }

    public Task<PagedResponse<OrderListItemDto>> GetAvailableOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default)
    {
        query.Status = OrderStatus.Available;
        return ListDriverOrdersAsync(_dbContext.Orders.AsNoTracking(), query, cancellationToken);
    }

    public async Task<PagedResponse<OrderListItemDto>> GetActiveOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default)
    {
        var driver = await GetCurrentDriverAsync(cancellationToken);
        var baseQuery = _dbContext.Orders.AsNoTracking()
            .Where(order => order.Assignments.Any(assignment =>
                assignment.DriverId == driver.Id && assignment.IsActive &&
                (order.Status == OrderStatus.Accepted || order.Status == OrderStatus.PickedUp)));

        return await ListDriverOrdersAsync(baseQuery, query, cancellationToken);
    }

    public async Task<PagedResponse<OrderListItemDto>> GetDeliveredOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default)
    {
        var driver = await GetCurrentDriverAsync(cancellationToken);
        query.Status = OrderStatus.Delivered;
        var baseQuery = _dbContext.Orders.AsNoTracking()
            .Where(order => order.Assignments.Any(assignment => assignment.DriverId == driver.Id));

        return await ListDriverOrdersAsync(baseQuery, query, cancellationToken);
    }

    public async Task<OrderDetailsDto> GetOrderByIdAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var driver = await GetCurrentDriverAsync(cancellationToken);
        var order = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);

        var isAssignedToDriver = order.Assignments.Any(assignment => assignment.DriverId == driver.Id);
        if (order.Status != OrderStatus.Available && !isAssignedToDriver)
        {
            throw new ForbiddenAppException("Drivers can only view available orders or orders assigned to them.");
        }

        return order.ToDetailsDto(GetAvailableDriverActions(order, driver.Id));
    }

    public async Task<OrderDetailsDto> AcceptOrderAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var driver = await GetCurrentDriverAsync(cancellationToken);
        var order = await LoadOrderAsync(orderId, asTracking: true, cancellationToken);

        if (!driver.IsAvailable)
        {
            throw new ConflictAppException("Your driver profile is currently marked unavailable.");
        }

        if (!OrderStatusTransitionPolicy.CanTransition(order.Status, OrderStatus.Accepted))
        {
            throw new ConflictAppException($"Order {order.PublicOrderNumber} is no longer available.");
        }

        if (order.Assignments.Any(assignment => assignment.IsActive))
        {
            throw new ConflictAppException($"Order {order.PublicOrderNumber} already has an active assignment.");
        }

        var now = _dateTimeProvider.UtcNow;
        var fromStatus = order.Status;
        order.Status = OrderStatus.Accepted;
        _dbContext.OrderAssignments.Add(new OrderAssignment
        {
            OrderId = order.Id,
            DriverId = driver.Id,
            AcceptedAtUtc = now,
            IsActive = true
        });
        AddHistory(order, fromStatus, OrderStatus.Accepted, "Accepted by driver", now);

        await _dbContext.SaveChangesAsync(cancellationToken);
        var updated = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);
        return updated.ToDetailsDto(GetAvailableDriverActions(updated, driver.Id));
    }

    public async Task<OrderDetailsDto> MarkPickedUpAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var driver = await GetCurrentDriverAsync(cancellationToken);
        var order = await LoadOrderAsync(orderId, asTracking: true, cancellationToken);
        var assignment = GetActiveAssignmentForDriver(order, driver.Id);

        if (!OrderStatusTransitionPolicy.CanTransition(order.Status, OrderStatus.PickedUp))
        {
            throw new ConflictAppException($"Order {order.PublicOrderNumber} cannot be marked as picked up from status {order.Status}.");
        }

        var now = _dateTimeProvider.UtcNow;
        var fromStatus = order.Status;
        order.Status = OrderStatus.PickedUp;
        assignment.PickedUpAtUtc = now;
        AddHistory(order, fromStatus, OrderStatus.PickedUp, "Picked up by driver", now);

        await _dbContext.SaveChangesAsync(cancellationToken);
        var updated = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);
        return updated.ToDetailsDto(GetAvailableDriverActions(updated, driver.Id));
    }

    public async Task<OrderDetailsDto> MarkDeliveredAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var driver = await GetCurrentDriverAsync(cancellationToken);
        var order = await LoadOrderAsync(orderId, asTracking: true, cancellationToken);
        var assignment = GetActiveAssignmentForDriver(order, driver.Id);

        if (!OrderStatusTransitionPolicy.CanTransition(order.Status, OrderStatus.Delivered))
        {
            throw new ConflictAppException($"Order {order.PublicOrderNumber} cannot be marked as delivered from status {order.Status}.");
        }

        var now = _dateTimeProvider.UtcNow;
        var fromStatus = order.Status;
        order.Status = OrderStatus.Delivered;
        order.DeliveredAtUtc = now;
        assignment.DeliveredAtUtc = now;
        assignment.IsActive = false;
        AddHistory(order, fromStatus, OrderStatus.Delivered, "Delivered by driver", now);

        await _dbContext.SaveChangesAsync(cancellationToken);
        var updated = await LoadOrderAsync(orderId, asTracking: false, cancellationToken);
        return updated.ToDetailsDto(GetAvailableDriverActions(updated, driver.Id));
    }

    private async Task<PagedResponse<OrderListItemDto>> ListDriverOrdersAsync(
        IQueryable<Order> baseQuery,
        OrderQueryParameters query,
        CancellationToken cancellationToken)
    {
        var filtered = baseQuery.WithOrderGraph().ApplyFilters(query);
        var totalCount = await filtered.CountAsync(cancellationToken);
        var orders = await filtered
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

    private async Task<DriverProfile> GetCurrentDriverAsync(CancellationToken cancellationToken)
    {
        if (!_userContext.IsAuthenticated)
        {
            throw new AuthenticationAppException();
        }

        var driver = await _dbContext.DriverProfiles
            .Include(profile => profile.User)
            .SingleOrDefaultAsync(profile => profile.UserId == _userContext.UserId, cancellationToken);

        return driver ?? throw new ForbiddenAppException("The current user does not have a driver profile.");
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

    private OrderAssignment GetActiveAssignmentForDriver(Order order, Guid driverId)
    {
        var assignment = order.Assignments.SingleOrDefault(entity => entity.IsActive && entity.DriverId == driverId);
        return assignment ?? throw new ForbiddenAppException("This order is not actively assigned to you.");
    }

    private void AddHistory(Order order, OrderStatus from, OrderStatus to, string reason, DateTime changedAtUtc)
    {
        _dbContext.OrderStatusHistory.Add(new OrderStatusHistory
        {
            OrderId = order.Id,
            FromStatus = from,
            ToStatus = to,
            ChangedByUserId = _userContext.UserId,
            ChangedAtUtc = changedAtUtc,
            Reason = reason
        });
    }

    private static IReadOnlyCollection<string> GetAvailableDriverActions(Order order, Guid driverId)
    {
        var activeAssignment = order.Assignments.SingleOrDefault(assignment => assignment.IsActive);
        if (order.Status == OrderStatus.Available)
        {
            return ["Accept"];
        }

        if (activeAssignment?.DriverId != driverId)
        {
            return Array.Empty<string>();
        }

        return order.Status switch
        {
            OrderStatus.Accepted => ["MarkPickedUp"],
            OrderStatus.PickedUp => ["MarkDelivered"],
            _ => Array.Empty<string>()
        };
    }
}
