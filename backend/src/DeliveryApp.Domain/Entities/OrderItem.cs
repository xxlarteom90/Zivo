using DeliveryApp.Domain.Common;
using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Domain.Entities;

public sealed class OrderItem : Entity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public OrderItemType ItemType { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal? EstimatedWeightKg { get; set; }
    public string? Notes { get; set; }
}
