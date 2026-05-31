using DeliveryApp.Application.Common;
using DeliveryApp.Application.Customers;
using DeliveryApp.Application.PartnerBusinesses;
using DeliveryApp.Domain.Entities;
using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Application.Orders;

public static class OrderMappingExtensions
{
    public static AddressDto ToDto(this Address address) => new(
        address.Id,
        address.Line1,
        address.Line2,
        address.City,
        address.CountyOrRegion,
        address.PostalCode,
        address.Country,
        address.Latitude,
        address.Longitude,
        address.ToSingleLine());

    public static OrderListItemDto ToListItemDto(this Order order)
    {
        return new OrderListItemDto
        {
            Id = order.Id,
            PublicOrderNumber = order.PublicOrderNumber,
            Status = order.Status.ToString(),
            PartnerBusinessName = order.PartnerBusiness.Name,
            CustomerName = order.Customer.FullName,
            PickupAddressSummary = order.PickupAddress.ToSingleLine(),
            DeliveryAddressSummary = order.DeliveryAddress.ToSingleLine(),
            PickupWindowStartUtc = order.PickupWindowStartUtc,
            PickupWindowEndUtc = order.PickupWindowEndUtc,
            DeliveryWindowStartUtc = order.DeliveryWindowStartUtc,
            DeliveryWindowEndUtc = order.DeliveryWindowEndUtc,
            ItemSummary = BuildItemSummary(order.Items),
            HasSpecialInstructions = !string.IsNullOrWhiteSpace(order.SpecialInstructions)
        };
    }

    public static OrderDetailsDto ToDetailsDto(this Order order, IReadOnlyCollection<string> availableActions)
    {
        var activeAssignment = order.Assignments
            .Where(assignment => assignment.IsActive)
            .OrderByDescending(assignment => assignment.AcceptedAtUtc)
            .FirstOrDefault();

        return new OrderDetailsDto
        {
            Id = order.Id,
            PublicOrderNumber = order.PublicOrderNumber,
            Status = order.Status.ToString(),
            PartnerBusiness = new PartnerBusinessSummaryDto(
                order.PartnerBusiness.Id,
                order.PartnerBusiness.Name,
                order.PartnerBusiness.BusinessType.ToString(),
                order.PartnerBusiness.PhoneNumber,
                order.PartnerBusiness.Email),
            Customer = new CustomerSummaryDto(
                order.Customer.Id,
                order.Customer.FullName,
                order.Customer.PhoneNumber,
                order.Customer.Email),
            PickupAddress = order.PickupAddress.ToDto(),
            DeliveryAddress = order.DeliveryAddress.ToDto(),
            Items = order.Items
                .OrderBy(item => item.ItemType)
                .ThenBy(item => item.Description)
                .Select(item => new OrderItemDto(
                    item.Id,
                    item.ItemType.ToString(),
                    item.Description,
                    item.Quantity,
                    item.EstimatedWeightKg,
                    item.Notes))
                .ToArray(),
            Assignment = activeAssignment is null
                ? null
                : new OrderAssignmentDto(
                    activeAssignment.DriverId,
                    activeAssignment.Driver.User.FullName,
                    activeAssignment.AcceptedAtUtc,
                    activeAssignment.PickedUpAtUtc,
                    activeAssignment.DeliveredAtUtc),
            StatusHistory = order.StatusHistory
                .OrderByDescending(history => history.ChangedAtUtc)
                .Select(history => new OrderStatusHistoryDto(
                    history.Id,
                    history.FromStatus?.ToString(),
                    history.ToStatus.ToString(),
                    history.ChangedByUser.FullName,
                    history.ChangedAtUtc,
                    history.Reason,
                    history.Notes))
                .ToArray(),
            AvailableActions = availableActions,
            PickupWindowStartUtc = order.PickupWindowStartUtc,
            PickupWindowEndUtc = order.PickupWindowEndUtc,
            DeliveryWindowStartUtc = order.DeliveryWindowStartUtc,
            DeliveryWindowEndUtc = order.DeliveryWindowEndUtc,
            Notes = order.Notes,
            SpecialInstructions = order.SpecialInstructions,
            CreatedAtUtc = order.CreatedAtUtc,
            UpdatedAtUtc = order.UpdatedAtUtc
        };
    }

    private static string BuildItemSummary(IEnumerable<OrderItem> items)
    {
        var groupedItems = items
            .GroupBy(item => item.ItemType)
            .Select(group => $"{group.Sum(item => item.Quantity)} {ToFriendlyPlural(group.Key, group.Sum(item => item.Quantity))}")
            .ToArray();

        return groupedItems.Length == 0 ? "No items" : string.Join(", ", groupedItems);
    }

    private static string ToFriendlyPlural(OrderItemType type, int quantity)
    {
        var singular = type switch
        {
            OrderItemType.ClothesBag => "clothes bag",
            OrderItemType.FurnitureCover => "furniture cover",
            _ => type.ToString().ToLowerInvariant()
        };

        return quantity == 1 ? singular : singular + "s";
    }
}
