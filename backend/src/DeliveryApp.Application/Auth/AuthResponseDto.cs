namespace DeliveryApp.Application.Auth;

public sealed record AuthenticatedUserDto(
    Guid Id,
    string Email,
    string FullName,
    IReadOnlyCollection<string> Roles);

public sealed record AuthResponseDto(
    string AccessToken,
    DateTime ExpiresAtUtc,
    AuthenticatedUserDto User);

public sealed record MeDto(
    Guid Id,
    string Email,
    string FullName,
    IReadOnlyCollection<string> Roles);
