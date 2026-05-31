using DeliveryApp.Application.Common;
using DeliveryApp.Application.Customers;
using DeliveryApp.Application.PartnerBusinesses;

namespace DeliveryApp.Application.Orders;

public sealed record OrderItemDto(
    Guid Id,
    string ItemType,
    string Description,
    int Quantity,
    decimal? EstimatedWeightKg,
    string? Notes);

public sealed record CreateOrderItemDto(
    string ItemType,
    string Description,
    int Quantity,
    decimal? EstimatedWeightKg,
    string? Notes);

public sealed record OrderAssignmentDto(
    Guid DriverId,
    string DriverName,
    DateTime AcceptedAtUtc,
    DateTime? PickedUpAtUtc,
    DateTime? DeliveredAtUtc);

public sealed record OrderStatusHistoryDto(
    Guid Id,
    string? FromStatus,
    string ToStatus,
    string ChangedBy,
    DateTime ChangedAtUtc,
    string? Reason,
    string? Notes);

public sealed class OrderListItemDto
{
    public Guid Id { get; init; }
    public string PublicOrderNumber { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string PartnerBusinessName { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string PickupAddressSummary { get; init; } = string.Empty;
    public string DeliveryAddressSummary { get; init; } = string.Empty;
    public DateTime? PickupWindowStartUtc { get; init; }
    public DateTime? PickupWindowEndUtc { get; init; }
    public DateTime? DeliveryWindowStartUtc { get; init; }
    public DateTime? DeliveryWindowEndUtc { get; init; }
    public string ItemSummary { get; init; } = string.Empty;
    public bool HasSpecialInstructions { get; init; }
}

public sealed class OrderDetailsDto
{
    public Guid Id { get; init; }
    public string PublicOrderNumber { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public PartnerBusinessSummaryDto PartnerBusiness { get; init; } = null!;
    public CustomerSummaryDto Customer { get; init; } = null!;
    public AddressDto PickupAddress { get; init; } = null!;
    public AddressDto DeliveryAddress { get; init; } = null!;
    public IReadOnlyCollection<OrderItemDto> Items { get; init; } = Array.Empty<OrderItemDto>();
    public OrderAssignmentDto? Assignment { get; init; }
    public IReadOnlyCollection<OrderStatusHistoryDto> StatusHistory { get; init; } = Array.Empty<OrderStatusHistoryDto>();
    public IReadOnlyCollection<string> AvailableActions { get; init; } = Array.Empty<string>();
    public DateTime? PickupWindowStartUtc { get; init; }
    public DateTime? PickupWindowEndUtc { get; init; }
    public DateTime? DeliveryWindowStartUtc { get; init; }
    public DateTime? DeliveryWindowEndUtc { get; init; }
    public string? Notes { get; init; }
    public string? SpecialInstructions { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; init; }
}

public sealed class CreateOrderRequestDto
{
    public Guid PartnerBusinessId { get; set; }
    public Guid CustomerId { get; set; }
    public CreateAddressDto PickupAddress { get; set; } = null!;
    public CreateAddressDto DeliveryAddress { get; set; } = null!;
    public DateTime? PickupWindowStartUtc { get; set; }
    public DateTime? PickupWindowEndUtc { get; set; }
    public DateTime? DeliveryWindowStartUtc { get; set; }
    public DateTime? DeliveryWindowEndUtc { get; set; }
    public string? Notes { get; set; }
    public string? SpecialInstructions { get; set; }
    public IReadOnlyCollection<CreateOrderItemDto> Items { get; set; } = Array.Empty<CreateOrderItemDto>();
}

public sealed class UpdateOrderRequestDto
{
    public Guid? PartnerBusinessId { get; set; }
    public Guid? CustomerId { get; set; }
    public CreateAddressDto? PickupAddress { get; set; }
    public CreateAddressDto? DeliveryAddress { get; set; }
    public DateTime? PickupWindowStartUtc { get; set; }
    public DateTime? PickupWindowEndUtc { get; set; }
    public DateTime? DeliveryWindowStartUtc { get; set; }
    public DateTime? DeliveryWindowEndUtc { get; set; }
    public string? Notes { get; set; }
    public string? SpecialInstructions { get; set; }
}

public sealed class CancelOrderRequestDto
{
    public string Reason { get; set; } = "Cancelled by dispatcher";
    public string? Notes { get; set; }
}
