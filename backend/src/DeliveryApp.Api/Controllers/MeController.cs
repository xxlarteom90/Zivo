using DeliveryApp.Application.Auth;
using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryApp.Api.Controllers;

[Authorize]
[Route("api/me")]
public sealed class MeController : ApiControllerBase
{
    private readonly IAuthService _authService;

    public MeController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<MeDto>>> GetMe(CancellationToken cancellationToken)
    {
        var me = await _authService.GetCurrentUserAsync(cancellationToken);
        return Envelope(me);
    }
}
