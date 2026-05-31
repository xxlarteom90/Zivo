using DeliveryApp.Application.Auth;

namespace DeliveryApp.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<MeDto> GetCurrentUserAsync(CancellationToken cancellationToken = default);
}
