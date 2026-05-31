using DeliveryApp.Domain.Common;

namespace DeliveryApp.Domain.Entities;

public sealed class UserPreferences : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Language { get; set; } = "ro";
    public string Appearance { get; set; } = "system";
    public bool ReducedMotion { get; set; }
    public string VehicleType { get; set; } = "car";
    public string NavigationApp { get; set; } = "Google Maps";
}
