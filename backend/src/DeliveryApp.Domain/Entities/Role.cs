using DeliveryApp.Domain.Common;

namespace DeliveryApp.Domain.Entities;

public sealed class Role : Entity
{
    public string Name { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
