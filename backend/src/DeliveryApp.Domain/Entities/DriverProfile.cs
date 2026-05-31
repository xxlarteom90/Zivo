using DeliveryApp.Domain.Common;

namespace DeliveryApp.Domain.Entities;

public sealed class DriverProfile : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string? VehicleDescription { get; set; }
    public string? LicensePlate { get; set; }
    public bool IsAvailable { get; set; } = true;

    public ICollection<OrderAssignment> Assignments { get; set; } = new List<OrderAssignment>();
}
