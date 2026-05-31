using DeliveryApp.Domain.Common;
using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Domain.Entities;

public sealed class OrderStatusHistory : Entity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public OrderStatus? FromStatus { get; set; }
    public OrderStatus ToStatus { get; set; }

    public Guid ChangedByUserId { get; set; }
    public User ChangedByUser { get; set; } = null!;

    public DateTime ChangedAtUtc { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
}
