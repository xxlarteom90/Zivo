using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace DeliveryApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IDriverOrderService, DriverOrderService>();
        services.AddScoped<IDriverPerformanceService, DriverPerformanceService>();
        return services;
    }
}
