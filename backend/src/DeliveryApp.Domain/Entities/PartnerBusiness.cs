using DeliveryApp.Domain.Common;
using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Domain.Entities;

public sealed class PartnerBusiness : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public PartnerBusinessType BusinessType { get; set; }
    public string? ContactName { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public Guid AddressId { get; set; }
    public Address Address { get; set; } = null!;
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
