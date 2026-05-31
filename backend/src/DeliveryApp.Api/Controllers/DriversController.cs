using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Api.Controllers;

[Authorize(Roles = ApiRoles.DispatcherOrAdmin)]
[Route("api/drivers")]
public sealed class DriversController : ApiControllerBase
{
    private readonly IApplicationDbContext _dbContext;

    public DriversController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<DriverListItemDto>>>> GetDrivers(CancellationToken cancellationToken)
    {
        var drivers = await _dbContext.DriverProfiles
            .AsNoTracking()
            .Include(driver => driver.User)
            .OrderBy(driver => driver.User.FullName)
            .Select(driver => new DriverListItemDto(
                driver.Id,
                driver.User.FullName,
                driver.User.Email,
                driver.User.PhoneNumber,
                driver.VehicleDescription,
                driver.LicensePlate,
                driver.IsAvailable))
            .ToListAsync(cancellationToken);

        return Envelope<IReadOnlyCollection<DriverListItemDto>>(drivers);
    }

    [HttpPut("{id:guid}/availability")]
    public async Task<ActionResult<ApiResponse<DriverListItemDto>>> UpdateAvailability(Guid id, UpdateDriverAvailabilityRequest request, CancellationToken cancellationToken)
    {
        var driver = await _dbContext.DriverProfiles
            .Include(profile => profile.User)
            .SingleOrDefaultAsync(profile => profile.Id == id, cancellationToken)
            ?? throw new NotFoundAppException("Driver", id);

        driver.IsAvailable = request.IsAvailable;
        await _dbContext.SaveChangesAsync(cancellationToken);

        var dto = new DriverListItemDto(driver.Id, driver.User.FullName, driver.User.Email, driver.User.PhoneNumber, driver.VehicleDescription, driver.LicensePlate, driver.IsAvailable);
        return Envelope(dto);
    }
}

public sealed record DriverListItemDto(Guid Id, string FullName, string Email, string? PhoneNumber, string? VehicleDescription, string? LicensePlate, bool IsAvailable);
public sealed record UpdateDriverAvailabilityRequest(bool IsAvailable);
