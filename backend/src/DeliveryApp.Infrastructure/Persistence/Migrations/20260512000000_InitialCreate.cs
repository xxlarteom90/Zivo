using System;
using DeliveryApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeliveryApp.Infrastructure.Persistence.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260512000000_InitialCreate")]
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "addresses",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Line1 = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                Line2 = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                City = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                CountyOrRegion = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                PostalCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                Country = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                Latitude = table.Column<decimal>(type: "numeric(9,6)", nullable: true),
                Longitude = table.Column<decimal>(type: "numeric(9,6)", nullable: true),
                CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_addresses", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "roles",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_roles", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "users",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                PasswordHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                FullName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                PhoneNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                IsActive = table.Column<bool>(type: "boolean", nullable: false),
                CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_users", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "customers",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                FullName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                PhoneNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                DefaultAddressId = table.Column<Guid>(type: "uuid", nullable: true),
                Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_customers", x => x.Id);
                table.ForeignKey(
                    name: "FK_customers_addresses_DefaultAddressId",
                    column: x => x.DefaultAddressId,
                    principalTable: "addresses",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "partner_businesses",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                BusinessType = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                ContactName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                PhoneNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                AddressId = table.Column<Guid>(type: "uuid", nullable: false),
                Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                IsActive = table.Column<bool>(type: "boolean", nullable: false),
                CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_partner_businesses", x => x.Id);
                table.ForeignKey(
                    name: "FK_partner_businesses_addresses_AddressId",
                    column: x => x.AddressId,
                    principalTable: "addresses",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "driver_profiles",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                VehicleDescription = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                LicensePlate = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                IsAvailable = table.Column<bool>(type: "boolean", nullable: false),
                CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_driver_profiles", x => x.Id);
                table.ForeignKey(
                    name: "FK_driver_profiles_users_UserId",
                    column: x => x.UserId,
                    principalTable: "users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "user_roles",
            columns: table => new
            {
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                RoleId = table.Column<Guid>(type: "uuid", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_user_roles", x => new { x.UserId, x.RoleId });
                table.ForeignKey(
                    name: "FK_user_roles_roles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "roles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_user_roles_users_UserId",
                    column: x => x.UserId,
                    principalTable: "users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "orders",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                PublicOrderNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                PartnerBusinessId = table.Column<Guid>(type: "uuid", nullable: false),
                CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                PickupAddressId = table.Column<Guid>(type: "uuid", nullable: false),
                DeliveryAddressId = table.Column<Guid>(type: "uuid", nullable: false),
                Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                PickupWindowStartUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                PickupWindowEndUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                DeliveryWindowStartUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                DeliveryWindowEndUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                SpecialInstructions = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                CancelledAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                DeliveredAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_orders", x => x.Id);
                table.ForeignKey("FK_orders_addresses_DeliveryAddressId", x => x.DeliveryAddressId, "addresses", "Id", onDelete: ReferentialAction.Restrict);
                table.ForeignKey("FK_orders_addresses_PickupAddressId", x => x.PickupAddressId, "addresses", "Id", onDelete: ReferentialAction.Restrict);
                table.ForeignKey("FK_orders_customers_CustomerId", x => x.CustomerId, "customers", "Id", onDelete: ReferentialAction.Restrict);
                table.ForeignKey("FK_orders_partner_businesses_PartnerBusinessId", x => x.PartnerBusinessId, "partner_businesses", "Id", onDelete: ReferentialAction.Restrict);
                table.ForeignKey("FK_orders_users_CreatedByUserId", x => x.CreatedByUserId, "users", "Id", onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "order_assignments",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                DriverId = table.Column<Guid>(type: "uuid", nullable: false),
                AcceptedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                PickedUpAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                DeliveredAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                CancelledAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                IsActive = table.Column<bool>(type: "boolean", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_order_assignments", x => x.Id);
                table.ForeignKey("FK_order_assignments_driver_profiles_DriverId", x => x.DriverId, "driver_profiles", "Id", onDelete: ReferentialAction.Restrict);
                table.ForeignKey("FK_order_assignments_orders_OrderId", x => x.OrderId, "orders", "Id", onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "order_items",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                ItemType = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                Description = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                Quantity = table.Column<int>(type: "integer", nullable: false),
                EstimatedWeightKg = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_order_items", x => x.Id);
                table.ForeignKey("FK_order_items_orders_OrderId", x => x.OrderId, "orders", "Id", onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "order_status_history",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                FromStatus = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                ToStatus = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                ChangedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                ChangedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Reason = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_order_status_history", x => x.Id);
                table.ForeignKey("FK_order_status_history_orders_OrderId", x => x.OrderId, "orders", "Id", onDelete: ReferentialAction.Cascade);
                table.ForeignKey("FK_order_status_history_users_ChangedByUserId", x => x.ChangedByUserId, "users", "Id", onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex("IX_customers_DefaultAddressId", "customers", "DefaultAddressId");
        migrationBuilder.CreateIndex("IX_customers_FullName", "customers", "FullName");
        migrationBuilder.CreateIndex("IX_driver_profiles_UserId", "driver_profiles", "UserId", unique: true);
        migrationBuilder.CreateIndex("IX_order_assignments_DriverId", "order_assignments", "DriverId");
        migrationBuilder.CreateIndex("IX_order_assignments_OrderId", "order_assignments", "OrderId", unique: true, filter: "\"IsActive\" = true");
        migrationBuilder.CreateIndex("IX_order_items_OrderId", "order_items", "OrderId");
        migrationBuilder.CreateIndex("IX_order_status_history_ChangedByUserId", "order_status_history", "ChangedByUserId");
        migrationBuilder.CreateIndex("IX_order_status_history_OrderId", "order_status_history", "OrderId");
        migrationBuilder.CreateIndex("IX_orders_CreatedAtUtc", "orders", "CreatedAtUtc");
        migrationBuilder.CreateIndex("IX_orders_CreatedByUserId", "orders", "CreatedByUserId");
        migrationBuilder.CreateIndex("IX_orders_CustomerId", "orders", "CustomerId");
        migrationBuilder.CreateIndex("IX_orders_DeliveryAddressId", "orders", "DeliveryAddressId");
        migrationBuilder.CreateIndex("IX_orders_PartnerBusinessId", "orders", "PartnerBusinessId");
        migrationBuilder.CreateIndex("IX_orders_PickupAddressId", "orders", "PickupAddressId");
        migrationBuilder.CreateIndex("IX_orders_PickupWindowStartUtc", "orders", "PickupWindowStartUtc");
        migrationBuilder.CreateIndex("IX_orders_PublicOrderNumber", "orders", "PublicOrderNumber", unique: true);
        migrationBuilder.CreateIndex("IX_orders_Status", "orders", "Status");
        migrationBuilder.CreateIndex("IX_partner_businesses_AddressId", "partner_businesses", "AddressId");
        migrationBuilder.CreateIndex("IX_partner_businesses_Name", "partner_businesses", "Name");
        migrationBuilder.CreateIndex("IX_roles_Name", "roles", "Name", unique: true);
        migrationBuilder.CreateIndex("IX_user_roles_RoleId", "user_roles", "RoleId");
        migrationBuilder.CreateIndex("IX_users_Email", "users", "Email", unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "order_assignments");
        migrationBuilder.DropTable(name: "order_items");
        migrationBuilder.DropTable(name: "order_status_history");
        migrationBuilder.DropTable(name: "user_roles");
        migrationBuilder.DropTable(name: "driver_profiles");
        migrationBuilder.DropTable(name: "orders");
        migrationBuilder.DropTable(name: "roles");
        migrationBuilder.DropTable(name: "customers");
        migrationBuilder.DropTable(name: "partner_businesses");
        migrationBuilder.DropTable(name: "users");
        migrationBuilder.DropTable(name: "addresses");
    }
}
