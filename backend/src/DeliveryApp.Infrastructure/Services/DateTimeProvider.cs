using DeliveryApp.Application.Interfaces;

namespace DeliveryApp.Infrastructure.Services;

public sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
