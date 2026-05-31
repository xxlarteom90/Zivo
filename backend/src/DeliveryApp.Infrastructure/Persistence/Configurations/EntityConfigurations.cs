using DeliveryApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeliveryApp.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(user => user.Id);
        builder.Property(user => user.Email).HasMaxLength(256).IsRequired();
        builder.Property(user => user.PasswordHash).HasMaxLength(512).IsRequired();
        builder.Property(user => user.FullName).HasMaxLength(200).IsRequired();
        builder.Property(user => user.PhoneNumber).HasMaxLength(50);
        builder.HasIndex(user => user.Email).IsUnique();
    }
}

public sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");
        builder.HasKey(role => role.Id);
        builder.Property(role => role.Name).HasMaxLength(64).IsRequired();
        builder.HasIndex(role => role.Name).IsUnique();
    }
}

public sealed class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles");
        builder.HasKey(userRole => new { userRole.UserId, userRole.RoleId });
        builder.HasOne(userRole => userRole.User).WithMany(user => user.UserRoles).HasForeignKey(userRole => userRole.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(userRole => userRole.Role).WithMany(role => role.UserRoles).HasForeignKey(userRole => userRole.RoleId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class DriverProfileConfiguration : IEntityTypeConfiguration<DriverProfile>
{
    public void Configure(EntityTypeBuilder<DriverProfile> builder)
    {
        builder.ToTable("driver_profiles");
        builder.HasKey(driver => driver.Id);
        builder.Property(driver => driver.VehicleDescription).HasMaxLength(200);
        builder.Property(driver => driver.LicensePlate).HasMaxLength(50);
        builder.HasOne(driver => driver.User).WithOne(user => user.DriverProfile).HasForeignKey<DriverProfile>(driver => driver.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(driver => driver.UserId).IsUnique();
    }
}

public sealed class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("addresses");
        builder.HasKey(address => address.Id);
        builder.Property(address => address.Line1).HasMaxLength(250).IsRequired();
        builder.Property(address => address.Line2).HasMaxLength(250);
        builder.Property(address => address.City).HasMaxLength(120).IsRequired();
        builder.Property(address => address.CountyOrRegion).HasMaxLength(120);
        builder.Property(address => address.PostalCode).HasMaxLength(50);
        builder.Property(address => address.Country).HasMaxLength(120).IsRequired();
        builder.Property(address => address.Latitude).HasPrecision(9, 6);
        builder.Property(address => address.Longitude).HasPrecision(9, 6);
    }
}

public sealed class PartnerBusinessConfiguration : IEntityTypeConfiguration<PartnerBusiness>
{
    public void Configure(EntityTypeBuilder<PartnerBusiness> builder)
    {
        builder.ToTable("partner_businesses");
        builder.HasKey(partner => partner.Id);
        builder.Property(partner => partner.Name).HasMaxLength(200).IsRequired();
        builder.Property(partner => partner.BusinessType).HasConversion<string>().HasMaxLength(64).IsRequired();
        builder.Property(partner => partner.ContactName).HasMaxLength(150);
        builder.Property(partner => partner.PhoneNumber).HasMaxLength(50).IsRequired();
        builder.Property(partner => partner.Email).HasMaxLength(256);
        builder.Property(partner => partner.Notes).HasMaxLength(1000);
        builder.HasOne(partner => partner.Address).WithMany().HasForeignKey(partner => partner.AddressId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(partner => partner.Name);
    }
}

public sealed class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers");
        builder.HasKey(customer => customer.Id);
        builder.Property(customer => customer.FullName).HasMaxLength(200).IsRequired();
        builder.Property(customer => customer.PhoneNumber).HasMaxLength(50).IsRequired();
        builder.Property(customer => customer.Email).HasMaxLength(256);
        builder.Property(customer => customer.Notes).HasMaxLength(1000);
        builder.HasOne(customer => customer.DefaultAddress).WithMany().HasForeignKey(customer => customer.DefaultAddressId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(customer => customer.FullName);
    }
}

public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");
        builder.HasKey(order => order.Id);
        builder.Property(order => order.PublicOrderNumber).HasMaxLength(50).IsRequired();
        builder.Property(order => order.Status).HasConversion<string>().HasMaxLength(40).IsRequired();
        builder.Property(order => order.Notes).HasMaxLength(2000);
        builder.Property(order => order.SpecialInstructions).HasMaxLength(2000);
        builder.HasIndex(order => order.PublicOrderNumber).IsUnique();
        builder.HasIndex(order => order.Status);
        builder.HasIndex(order => order.CreatedAtUtc);
        builder.HasIndex(order => order.PickupWindowStartUtc);
        builder.HasOne(order => order.PartnerBusiness).WithMany(partner => partner.Orders).HasForeignKey(order => order.PartnerBusinessId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(order => order.Customer).WithMany(customer => customer.Orders).HasForeignKey(order => order.CustomerId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(order => order.PickupAddress).WithMany().HasForeignKey(order => order.PickupAddressId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(order => order.DeliveryAddress).WithMany().HasForeignKey(order => order.DeliveryAddressId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(order => order.CreatedByUser).WithMany(user => user.CreatedOrders).HasForeignKey(order => order.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
    }
}

public sealed class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("order_items");
        builder.HasKey(item => item.Id);
        builder.Property(item => item.ItemType).HasConversion<string>().HasMaxLength(64).IsRequired();
        builder.Property(item => item.Description).HasMaxLength(300).IsRequired();
        builder.Property(item => item.EstimatedWeightKg).HasPrecision(10, 2);
        builder.Property(item => item.Notes).HasMaxLength(1000);
        builder.HasOne(item => item.Order).WithMany(order => order.Items).HasForeignKey(item => item.OrderId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class OrderAssignmentConfiguration : IEntityTypeConfiguration<OrderAssignment>
{
    public void Configure(EntityTypeBuilder<OrderAssignment> builder)
    {
        builder.ToTable("order_assignments");
        builder.HasKey(assignment => assignment.Id);
        builder.HasOne(assignment => assignment.Order).WithMany(order => order.Assignments).HasForeignKey(assignment => assignment.OrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(assignment => assignment.Driver).WithMany(driver => driver.Assignments).HasForeignKey(assignment => assignment.DriverId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(assignment => assignment.OrderId).HasFilter("\"IsActive\" = true").IsUnique();
        builder.HasIndex(assignment => assignment.DriverId);
    }
}

public sealed class OrderStatusHistoryConfiguration : IEntityTypeConfiguration<OrderStatusHistory>
{
    public void Configure(EntityTypeBuilder<OrderStatusHistory> builder)
    {
        builder.ToTable("order_status_history");
        builder.HasKey(history => history.Id);
        builder.Property(history => history.FromStatus).HasConversion<string>().HasMaxLength(40);
        builder.Property(history => history.ToStatus).HasConversion<string>().HasMaxLength(40).IsRequired();
        builder.Property(history => history.Reason).HasMaxLength(300);
        builder.Property(history => history.Notes).HasMaxLength(1000);
        builder.HasOne(history => history.Order).WithMany(order => order.StatusHistory).HasForeignKey(history => history.OrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(history => history.ChangedByUser).WithMany(user => user.StatusChanges).HasForeignKey(history => history.ChangedByUserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(history => history.OrderId);
        builder.HasIndex(history => history.ChangedByUserId);
    }
}
