using DeliveryApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<DriverProfile> DriverProfiles { get; }
    DbSet<Address> Addresses { get; }
    DbSet<PartnerBusiness> PartnerBusinesses { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<OrderAssignment> OrderAssignments { get; }
    DbSet<OrderStatusHistory> OrderStatusHistory { get; }
    DbSet<UserPreferences> UserPreferences { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
