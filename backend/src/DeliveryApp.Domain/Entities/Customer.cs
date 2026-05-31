using DeliveryApp.Domain.Common;

namespace DeliveryApp.Domain.Entities;

public sealed class Customer : AuditableEntity
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public Guid? DefaultAddressId { get; set; }
    public Address? DefaultAddress { get; set; }
    public string? Notes { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
