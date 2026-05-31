using DeliveryApp.Domain.Common;

namespace DeliveryApp.Domain.Entities;

public sealed class OrderAssignment : Entity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid DriverId { get; set; }
    public DriverProfile Driver { get; set; } = null!;

    public DateTime AcceptedAtUtc { get; set; }
    public DateTime? PickedUpAtUtc { get; set; }
    public DateTime? DeliveredAtUtc { get; set; }
    public DateTime? CancelledAtUtc { get; set; }
    public bool IsActive { get; set; } = true;
}
