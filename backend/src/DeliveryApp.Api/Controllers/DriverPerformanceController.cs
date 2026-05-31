using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Performance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryApp.Api.Controllers;

[Authorize(Roles = ApiRoles.Driver)]
[Route("api/driver/performance")]
public sealed class DriverPerformanceController : ApiControllerBase
{
    private readonly IDriverPerformanceService _performanceService;

    public DriverPerformanceController(IDriverPerformanceService performanceService)
    {
        _performanceService = performanceService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<DriverPerformanceDto>>> Get(
        [FromQuery] PerformancePeriod period = PerformancePeriod.Today,
        CancellationToken cancellationToken = default)
    {
        var result = await _performanceService.GetPerformanceAsync(period, cancellationToken);
        return Envelope(result);
    }
}
