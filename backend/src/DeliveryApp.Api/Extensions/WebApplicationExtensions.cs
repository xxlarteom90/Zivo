using DeliveryApp.Infrastructure.Persistence;
using DeliveryApp.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Api.Extensions;

public static class WebApplicationExtensions
{
    public static async Task ApplyMigrationsAndSeedAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseStartup");

        var applyMigrations = configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup");
        var seedDemoData = configuration.GetValue<bool>("Database:SeedDemoData");

        if (!applyMigrations && !seedDemoData)
        {
            return;
        }

        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (applyMigrations)
        {
            logger.LogInformation("Applying database migrations...");
            await dbContext.Database.MigrateAsync();
        }

        if (seedDemoData)
        {
            logger.LogInformation("Seeding demo data if database is empty...");
            var seeder = scope.ServiceProvider.GetRequiredService<DemoDataSeeder>();
            await seeder.SeedAsync();
        }
    }
}
