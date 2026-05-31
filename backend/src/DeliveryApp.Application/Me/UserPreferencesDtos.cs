namespace DeliveryApp.Application.Me;

public sealed record UserPreferencesDto(
    string Language,
    string Appearance,
    bool ReducedMotion,
    string VehicleType,
    string NavigationApp);

public sealed record UpdateUserPreferencesRequest(
    string? Language,
    string? Appearance,
    bool? ReducedMotion,
    string? VehicleType,
    string? NavigationApp);
