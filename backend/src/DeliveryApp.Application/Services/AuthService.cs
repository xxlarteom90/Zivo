using DeliveryApp.Application.Auth;
using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Application.Services;

public sealed class AuthService : IAuthService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IUserContext _userContext;

    public AuthService(
        IApplicationDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        IUserContext userContext)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _userContext = userContext;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();
        var email = ValidationHelper.RequireTrimmed(request.Email, nameof(request.Email), errors, 256).ToLowerInvariant();
        ValidationHelper.RequireTrimmed(request.Password, nameof(request.Password), errors, 200);
        ValidationHelper.EnsureNoErrors(errors);

        var user = await _dbContext.Users
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(user => user.Email == email, cancellationToken);

        if (user is null || !user.IsActive || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new AuthenticationAppException("Invalid email or password.");
        }

        var roles = user.UserRoles
            .Select(userRole => userRole.Role.Name)
            .OrderBy(role => role)
            .ToArray();

        return _jwtTokenService.CreateToken(user, roles);
    }

    public async Task<MeDto> GetCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        if (!_userContext.IsAuthenticated)
        {
            throw new AuthenticationAppException();
        }

        var user = await _dbContext.Users
            .Include(entity => entity.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .SingleOrDefaultAsync(entity => entity.Id == _userContext.UserId, cancellationToken);

        if (user is null || !user.IsActive)
        {
            throw new AuthenticationAppException("The current user account is no longer active.");
        }

        return new MeDto(
            user.Id,
            user.Email,
            user.FullName,
            user.UserRoles.Select(userRole => userRole.Role.Name).OrderBy(role => role).ToArray());
    }
}
