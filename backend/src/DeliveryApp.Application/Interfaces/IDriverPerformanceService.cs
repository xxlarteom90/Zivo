using DeliveryApp.Application.Performance;

namespace DeliveryApp.Application.Interfaces;

public interface IDriverPerformanceService
{
    Task<DriverPerformanceDto> GetPerformanceAsync(PerformancePeriod period, CancellationToken cancellationToken = default);
}
