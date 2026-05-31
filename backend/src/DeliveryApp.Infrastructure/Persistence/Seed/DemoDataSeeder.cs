using DeliveryApp.Application.Interfaces;
using DeliveryApp.Domain.Entities;
using DeliveryApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DeliveryApp.Infrastructure.Persistence.Seed;

public sealed class DemoDataSeeder
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<DemoDataSeeder> _logger;

    public DemoDataSeeder(ApplicationDbContext dbContext, IPasswordHasher passwordHasher, ILogger<DemoDataSeeder> logger)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTime.UtcNow;
        var adminRole = new Role { Id = SeedIds.AdminRoleId, Name = UserRoleName.Admin.ToString() };
        var dispatcherRole = new Role { Id = SeedIds.DispatcherRoleId, Name = UserRoleName.Dispatcher.ToString() };
        var driverRole = new Role { Id = SeedIds.DriverRoleId, Name = UserRoleName.Driver.ToString() };

        var admin = CreateUser(SeedIds.AdminUserId, "admin@example.com", "Admin User", "+40700000001", now);
        var dispatcher = CreateUser(SeedIds.DispatcherUserId, "dispatcher@example.com", "Dispatcher User", "+40700000002", now);
        var driver1User = CreateUser(SeedIds.Driver1UserId, "driver1@example.com", "Alex Driver", "+40700000003", now);
        var driver2User = CreateUser(SeedIds.Driver2UserId, "driver2@example.com", "Mara Driver", "+40700000004", now);

        var driver1 = new DriverProfile
        {
            Id = SeedIds.Driver1ProfileId,
            User = driver1User,
            VehicleDescription = "White Ford Transit",
            LicensePlate = "B-101-DRV",
            IsAvailable = true,
            CreatedAtUtc = now
        };
        var driver2 = new DriverProfile
        {
            Id = SeedIds.Driver2ProfileId,
            User = driver2User,
            VehicleDescription = "Blue Renault Kangoo",
            LicensePlate = "B-202-DRV",
            IsAvailable = true,
            CreatedAtUtc = now
        };

        _dbContext.Roles.AddRange(adminRole, dispatcherRole, driverRole);
        _dbContext.Users.AddRange(admin, dispatcher, driver1User, driver2User);
        _dbContext.UserRoles.AddRange(
            new UserRole { User = admin, Role = adminRole },
            new UserRole { User = dispatcher, Role = dispatcherRole },
            new UserRole { User = driver1User, Role = driverRole },
            new UserRole { User = driver2User, Role = driverRole });
        _dbContext.DriverProfiles.AddRange(driver1, driver2);

        var addresses = CreateBaseAddresses(now);
        _dbContext.Addresses.AddRange(addresses.Values);

        var partner1 = new PartnerBusiness
        {
            Id = Guid.Parse("7e3c1220-45af-4cbb-b1c4-e63a416b1111"),
            Name = "Fresh Carpet Cleaning",
            BusinessType = PartnerBusinessType.CarpetCleaning,
            ContactName = "Victor Partner",
            PhoneNumber = "+40210000001",
            Email = "contact@freshcarpets.example",
            Address = addresses["partner1"],
            Notes = "Large carpets require two-person handling.",
            CreatedAtUtc = now
        };
        var partner2 = new PartnerBusiness
        {
            Id = Guid.Parse("7e3c1220-45af-4cbb-b1c4-e63a416b2222"),
            Name = "Soft Pillow Care",
            BusinessType = PartnerBusinessType.PillowCleaning,
            ContactName = "Ioana Partner",
            PhoneNumber = "+40210000002",
            Email = "hello@softpillow.example",
            Address = addresses["partner2"],
            CreatedAtUtc = now
        };
        var partner3 = new PartnerBusiness
        {
            Id = Guid.Parse("7e3c1220-45af-4cbb-b1c4-e63a416b3333"),
            Name = "Quick Laundry Service",
            BusinessType = PartnerBusinessType.Laundry,
            ContactName = "Andrei Partner",
            PhoneNumber = "+40210000003",
            Email = "orders@quicklaundry.example",
            Address = addresses["partner3"],
            CreatedAtUtc = now
        };

        var customer1 = new Customer
        {
            Id = Guid.Parse("4c57d02c-5684-49fd-8b70-d944f5221111"),
            FullName = "Maria Popescu",
            PhoneNumber = "+40721000001",
            Email = "maria.popescu@example.com",
            DefaultAddress = addresses["customer1"],
            Notes = "Call before arriving.",
            CreatedAtUtc = now
        };
        var customer2 = new Customer
        {
            Id = Guid.Parse("4c57d02c-5684-49fd-8b70-d944f5222222"),
            FullName = "George Ionescu",
            PhoneNumber = "+40721000002",
            Email = "george.ionescu@example.com",
            DefaultAddress = addresses["customer2"],
            CreatedAtUtc = now
        };
        var customer3 = new Customer
        {
            Id = Guid.Parse("4c57d02c-5684-49fd-8b70-d944f5223333"),
            FullName = "Elena Dumitru",
            PhoneNumber = "+40721000003",
            Email = "elena.dumitru@example.com",
            DefaultAddress = addresses["customer3"],
            CreatedAtUtc = now
        };

        _dbContext.PartnerBusinesses.AddRange(partner1, partner2, partner3);
        _dbContext.Customers.AddRange(customer1, customer2, customer3);

        _dbContext.Orders.AddRange(
            CreateAvailableOrder(now, dispatcher.Id, partner1, customer1, addresses["pickup1"], addresses["delivery1"]),
            CreateAcceptedOrder(now, dispatcher.Id, partner2, customer2, addresses["pickup2"], addresses["delivery2"], driver1),
            CreatePickedUpOrder(now, dispatcher.Id, partner3, customer3, addresses["pickup3"], addresses["delivery3"], driver1),
            CreateDeliveredOrder(now, dispatcher.Id, partner1, customer2, addresses["pickup4"], addresses["delivery4"], driver2),
            CreateCancelledOrder(now, dispatcher.Id, partner2, customer1, addresses["pickup5"], addresses["delivery5"]));

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Demo seed data has been created. Password for all demo users is {Password}.", "Password123!");
    }

    private User CreateUser(Guid id, string email, string fullName, string phoneNumber, DateTime now) => new()
    {
        Id = id,
        Email = email,
        FullName = fullName,
        PhoneNumber = phoneNumber,
        PasswordHash = _passwordHasher.HashPassword("Password123!"),
        IsActive = true,
        CreatedAtUtc = now
    };

    private static Dictionary<string, Address> CreateBaseAddresses(DateTime now) => new()
    {
        ["partner1"] = CreateAddress("Calea Dorobanti 120", null, "Bucharest", "Bucharest", "010573", 44.453382m, 26.098522m, now),
        ["partner2"] = CreateAddress("Strada Polona 45", null, "Bucharest", "Bucharest", "010494", 44.445838m, 26.105309m, now),
        ["partner3"] = CreateAddress("Bulevardul Tineretului 17", null, "Bucharest", "Bucharest", "040535", 44.413921m, 26.108789m, now),
        ["customer1"] = CreateAddress("Strada Exemplu 10", "Apartment 5", "Bucharest", "Bucharest", "030111", 44.431214m, 26.102970m, now),
        ["customer2"] = CreateAddress("Bulevardul Unirii 20", null, "Bucharest", "Bucharest", "030833", 44.426767m, 26.110165m, now),
        ["customer3"] = CreateAddress("Strada Aviatorilor 8", null, "Bucharest", "Bucharest", "011851", 44.467644m, 26.086482m, now),
        ["pickup1"] = CreateAddress("Strada Exemplu 10", "Apartment 5", "Bucharest", "Bucharest", "030111", 44.431214m, 26.102970m, now),
        ["delivery1"] = CreateAddress("Calea Dorobanti 120", null, "Bucharest", "Bucharest", "010573", 44.453382m, 26.098522m, now),
        ["pickup2"] = CreateAddress("Bulevardul Unirii 20", null, "Bucharest", "Bucharest", "030833", 44.426767m, 26.110165m, now),
        ["delivery2"] = CreateAddress("Strada Polona 45", null, "Bucharest", "Bucharest", "010494", 44.445838m, 26.105309m, now),
        ["pickup3"] = CreateAddress("Strada Aviatorilor 8", null, "Bucharest", "Bucharest", "011851", 44.467644m, 26.086482m, now),
        ["delivery3"] = CreateAddress("Bulevardul Tineretului 17", null, "Bucharest", "Bucharest", "040535", 44.413921m, 26.108789m, now),
        ["pickup4"] = CreateAddress("Bulevardul Unirii 20", null, "Bucharest", "Bucharest", "030833", 44.426767m, 26.110165m, now),
        ["delivery4"] = CreateAddress("Calea Dorobanti 120", null, "Bucharest", "Bucharest", "010573", 44.453382m, 26.098522m, now),
        ["pickup5"] = CreateAddress("Strada Exemplu 10", "Apartment 5", "Bucharest", "Bucharest", "030111", 44.431214m, 26.102970m, now),
        ["delivery5"] = CreateAddress("Strada Polona 45", null, "Bucharest", "Bucharest", "010494", 44.445838m, 26.105309m, now)
    };

    private static Address CreateAddress(string line1, string? line2, string city, string region, string postalCode, decimal lat, decimal lng, DateTime now) => new()
    {
        Id = Guid.NewGuid(),
        Line1 = line1,
        Line2 = line2,
        City = city,
        CountyOrRegion = region,
        PostalCode = postalCode,
        Country = "Romania",
        Latitude = lat,
        Longitude = lng,
        CreatedAtUtc = now
    };

    private static Order CreateAvailableOrder(DateTime now, Guid userId, PartnerBusiness partner, Customer customer, Address pickup, Address delivery) =>
        CreateOrder("ORD-DEMO-0001", OrderStatus.Available, now, userId, partner, customer, pickup, delivery,
            [new OrderItem { ItemType = OrderItemType.Carpet, Description = "Large living room carpet", Quantity = 2, EstimatedWeightKg = 22m },
             new OrderItem { ItemType = OrderItemType.Pillow, Description = "Decorative pillows", Quantity = 3, EstimatedWeightKg = 3m }],
            "Customer requests morning pickup.", "Ring the bell twice.");

    private static Order CreateAcceptedOrder(DateTime now, Guid userId, PartnerBusiness partner, Customer customer, Address pickup, Address delivery, DriverProfile driver)
    {
        var order = CreateOrder("ORD-DEMO-0002", OrderStatus.Accepted, now, userId, partner, customer, pickup, delivery,
            [new OrderItem { ItemType = OrderItemType.Pillow, Description = "Sleeping pillows", Quantity = 6, EstimatedWeightKg = 4m }],
            "Leave receipt with partner business.", null);
        order.Assignments.Add(new OrderAssignment { Driver = driver, AcceptedAtUtc = now.AddMinutes(-45), IsActive = true });
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.Available, ToStatus = OrderStatus.Accepted, ChangedByUserId = driver.UserId, ChangedAtUtc = now.AddMinutes(-45), Reason = "Accepted by driver" });
        return order;
    }

    private static Order CreatePickedUpOrder(DateTime now, Guid userId, PartnerBusiness partner, Customer customer, Address pickup, Address delivery, DriverProfile driver)
    {
        var order = CreateOrder("ORD-DEMO-0003", OrderStatus.PickedUp, now, userId, partner, customer, pickup, delivery,
            [new OrderItem { ItemType = OrderItemType.ClothesBag, Description = "Laundry bags", Quantity = 4, EstimatedWeightKg = 18m }],
            "Deliver before close of business.", "Use service entrance.");
        order.Assignments.Add(new OrderAssignment { Driver = driver, AcceptedAtUtc = now.AddHours(-2), PickedUpAtUtc = now.AddMinutes(-60), IsActive = true });
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.Available, ToStatus = OrderStatus.Accepted, ChangedByUserId = driver.UserId, ChangedAtUtc = now.AddHours(-2), Reason = "Accepted by driver" });
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.Accepted, ToStatus = OrderStatus.PickedUp, ChangedByUserId = driver.UserId, ChangedAtUtc = now.AddMinutes(-60), Reason = "Picked up by driver" });
        return order;
    }

    private static Order CreateDeliveredOrder(DateTime now, Guid userId, PartnerBusiness partner, Customer customer, Address pickup, Address delivery, DriverProfile driver)
    {
        var order = CreateOrder("ORD-DEMO-0004", OrderStatus.Delivered, now.AddDays(-1), userId, partner, customer, pickup, delivery,
            [new OrderItem { ItemType = OrderItemType.Blanket, Description = "Wool blankets", Quantity = 2, EstimatedWeightKg = 8m }],
            null, null);
        order.DeliveredAtUtc = now.AddHours(-4);
        order.Assignments.Add(new OrderAssignment { Driver = driver, AcceptedAtUtc = now.AddDays(-1).AddHours(1), PickedUpAtUtc = now.AddDays(-1).AddHours(2), DeliveredAtUtc = now.AddHours(-4), IsActive = false });
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.Available, ToStatus = OrderStatus.Accepted, ChangedByUserId = driver.UserId, ChangedAtUtc = now.AddDays(-1).AddHours(1), Reason = "Accepted by driver" });
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.Accepted, ToStatus = OrderStatus.PickedUp, ChangedByUserId = driver.UserId, ChangedAtUtc = now.AddDays(-1).AddHours(2), Reason = "Picked up by driver" });
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.PickedUp, ToStatus = OrderStatus.Delivered, ChangedByUserId = driver.UserId, ChangedAtUtc = now.AddHours(-4), Reason = "Delivered by driver" });
        return order;
    }

    private static Order CreateCancelledOrder(DateTime now, Guid userId, PartnerBusiness partner, Customer customer, Address pickup, Address delivery)
    {
        var order = CreateOrder("ORD-DEMO-0005", OrderStatus.Cancelled, now.AddDays(-2), userId, partner, customer, pickup, delivery,
            [new OrderItem { ItemType = OrderItemType.Curtain, Description = "Curtains", Quantity = 5, EstimatedWeightKg = 7m }],
            null, "Cancelled due customer schedule change.");
        order.CancelledAtUtc = now.AddDays(-2).AddHours(2);
        order.StatusHistory.Add(new OrderStatusHistory { FromStatus = OrderStatus.Available, ToStatus = OrderStatus.Cancelled, ChangedByUserId = userId, ChangedAtUtc = now.AddDays(-2).AddHours(2), Reason = "Customer rescheduled" });
        return order;
    }

    private static Order CreateOrder(
        string number,
        OrderStatus status,
        DateTime createdAt,
        Guid userId,
        PartnerBusiness partner,
        Customer customer,
        Address pickup,
        Address delivery,
        IEnumerable<OrderItem> items,
        string? notes,
        string? specialInstructions)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            PublicOrderNumber = number,
            PartnerBusiness = partner,
            Customer = customer,
            PickupAddress = pickup,
            DeliveryAddress = delivery,
            Status = status,
            PickupWindowStartUtc = DateTime.UtcNow.Date.AddHours(8),
            PickupWindowEndUtc = DateTime.UtcNow.Date.AddHours(12),
            DeliveryWindowStartUtc = DateTime.UtcNow.Date.AddHours(13),
            DeliveryWindowEndUtc = DateTime.UtcNow.Date.AddHours(18),
            Notes = notes,
            SpecialInstructions = specialInstructions,
            CreatedByUserId = userId,
            CreatedAtUtc = createdAt
        };

        foreach (var item in items)
        {
            item.Id = Guid.NewGuid();
            order.Items.Add(item);
        }

        order.StatusHistory.Add(new OrderStatusHistory
        {
            FromStatus = null,
            ToStatus = OrderStatus.Available,
            ChangedByUserId = userId,
            ChangedAtUtc = createdAt,
            Reason = "Order created"
        });

        return order;
    }
}

public static class SeedIds
{
    public static readonly Guid AdminRoleId = Guid.Parse("3e872b5a-ad41-406a-b308-274ca1610001");
    public static readonly Guid DispatcherRoleId = Guid.Parse("3e872b5a-ad41-406a-b308-274ca1610002");
    public static readonly Guid DriverRoleId = Guid.Parse("3e872b5a-ad41-406a-b308-274ca1610003");

    public static readonly Guid AdminUserId = Guid.Parse("41e490af-d65f-4ee5-861a-dc6e8a110001");
    public static readonly Guid DispatcherUserId = Guid.Parse("41e490af-d65f-4ee5-861a-dc6e8a110002");
    public static readonly Guid Driver1UserId = Guid.Parse("41e490af-d65f-4ee5-861a-dc6e8a110003");
    public static readonly Guid Driver2UserId = Guid.Parse("41e490af-d65f-4ee5-861a-dc6e8a110004");

    public static readonly Guid Driver1ProfileId = Guid.Parse("57d14d6e-9fd6-4034-9d1f-7d9029910001");
    public static readonly Guid Driver2ProfileId = Guid.Parse("57d14d6e-9fd6-4034-9d1f-7d9029910002");
}
