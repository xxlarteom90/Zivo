using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Me;
using DeliveryApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Api.Controllers;

[Authorize]
[Route("api/me/preferences")]
public sealed class MePreferencesController : ApiControllerBase
{
    private static readonly HashSet<string> AllowedLanguages = new(StringComparer.OrdinalIgnoreCase)
    {
        "az","cs","et","en","el","hr","lv","lt","hu","pl","pt","ro","sk","fi","sv"
    };
    private static readonly HashSet<string> AllowedAppearance = new(StringComparer.OrdinalIgnoreCase) { "system", "light", "dark" };
    private static readonly HashSet<string> AllowedVehicle = new(StringComparer.OrdinalIgnoreCase) { "car", "bike", "foot" };
    private static readonly HashSet<string> AllowedNavApp = new(StringComparer.OrdinalIgnoreCase) { "Waze", "Google Maps", "Apple Maps" };

    private readonly IApplicationDbContext _dbContext;
    private readonly IUserContext _userContext;

    public MePreferencesController(IApplicationDbContext dbContext, IUserContext userContext)
    {
        _dbContext = dbContext;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<UserPreferencesDto>>> GetPreferences(CancellationToken cancellationToken)
    {
        var prefs = await GetOrCreateAsync(cancellationToken);
        return Envelope(ToDto(prefs));
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse<UserPreferencesDto>>> UpdatePreferences(UpdateUserPreferencesRequest request, CancellationToken cancellationToken)
    {
        var prefs = await GetOrCreateAsync(cancellationToken);
        var errors = new List<string>();

        if (request.Language is not null)
        {
            var value = request.Language.Trim();
            if (!AllowedLanguages.Contains(value)) errors.Add($"Language '{value}' is not supported.");
            else prefs.Language = value.ToLowerInvariant();
        }
        if (request.Appearance is not null)
        {
            var value = request.Appearance.Trim();
            if (!AllowedAppearance.Contains(value)) errors.Add($"Appearance '{value}' is not supported.");
            else prefs.Appearance = value.ToLowerInvariant();
        }
        if (request.VehicleType is not null)
        {
            var value = request.VehicleType.Trim();
            if (!AllowedVehicle.Contains(value)) errors.Add($"VehicleType '{value}' is not supported.");
            else prefs.VehicleType = value.ToLowerInvariant();
        }
        if (request.NavigationApp is not null)
        {
            var value = request.NavigationApp.Trim();
            if (!AllowedNavApp.Contains(value)) errors.Add($"NavigationApp '{value}' is not supported.");
            else prefs.NavigationApp = value;
        }
        if (request.ReducedMotion.HasValue)
        {
            prefs.ReducedMotion = request.ReducedMotion.Value;
        }

        if (errors.Count > 0)
        {
            throw new ValidationAppException("Invalid preferences.", errors);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return Envelope(ToDto(prefs));
    }

    private async Task<UserPreferences> GetOrCreateAsync(CancellationToken cancellationToken)
    {
        if (!_userContext.IsAuthenticated || _userContext.UserId == Guid.Empty)
        {
            throw new AuthenticationAppException();
        }

        var prefs = await _dbContext.UserPreferences
            .SingleOrDefaultAsync(p => p.UserId == _userContext.UserId, cancellationToken);

        if (prefs is null)
        {
            prefs = new UserPreferences { UserId = _userContext.UserId };
            _dbContext.UserPreferences.Add(prefs);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return prefs;
    }

    private static UserPreferencesDto ToDto(UserPreferences prefs) =>
        new(prefs.Language, prefs.Appearance, prefs.ReducedMotion, prefs.VehicleType, prefs.NavigationApp);
}
