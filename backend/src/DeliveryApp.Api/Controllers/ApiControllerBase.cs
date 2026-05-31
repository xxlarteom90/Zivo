using DeliveryApp.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryApp.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected ActionResult<ApiResponse<T>> Envelope<T>(T data) =>
        Ok(ApiResponse<T>.Success(data, HttpContext.TraceIdentifier));
}
