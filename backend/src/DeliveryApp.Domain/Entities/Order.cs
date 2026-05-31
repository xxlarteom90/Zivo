using DeliveryApp.Domain.Common;
using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Domain.Entities;

public sealed class Order : AuditableEntity
{
    public string PublicOrderNumber { get; set; } = string.Empty;

    public Guid PartnerBusinessId { get; set; }
    public PartnerBusiness PartnerBusiness { get; set; } = null!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public Guid PickupAddressId { get; set; }
    public Address PickupAddress { get; set; } = null!;

    public Guid DeliveryAddressId { get; set; }
    public Address DeliveryAddress { get; set; } = null!;

    public OrderStatus Status { get; set; } = OrderStatus.Available;

    public DateTime? PickupWindowStartUtc { get; set; }
    public DateTime? PickupWindowEndUtc { get; set; }
    public DateTime? DeliveryWindowStartUtc { get; set; }
    public DateTime? DeliveryWindowEndUtc { get; set; }

    public string? Notes { get; set; }
    public string? SpecialInstructions { get; set; }

    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public DateTime? CancelledAtUtc { get; set; }
    public DateTime? DeliveredAtUtc { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<OrderAssignment> Assignments { get; set; } = new List<OrderAssignment>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
}
