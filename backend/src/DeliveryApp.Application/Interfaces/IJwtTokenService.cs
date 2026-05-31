using DeliveryApp.Application.Auth;
using DeliveryApp.Domain.Entities;

namespace DeliveryApp.Application.Interfaces;

public interface IJwtTokenService
{
    AuthResponseDto CreateToken(User user, IReadOnlyCollection<string> roles);
}
