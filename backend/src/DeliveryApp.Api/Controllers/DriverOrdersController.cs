using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryApp.Api.Controllers;

[Authorize(Roles = ApiRoles.Driver)]
[Route("api/driver/orders")]
public sealed class DriverOrdersController : ApiControllerBase
{
    private readonly IDriverOrderService _driverOrderService;

    public DriverOrdersController(IDriverOrderService driverOrderService)
    {
        _driverOrderService = driverOrderService;
    }

    [HttpGet("available")]
    public async Task<ActionResult<ApiResponse<PagedResponse<OrderListItemDto>>>> GetAvailable([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.GetAvailableOrdersAsync(query, cancellationToken);
        return Envelope(result);
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<PagedResponse<OrderListItemDto>>>> GetActive([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.GetActiveOrdersAsync(query, cancellationToken);
        return Envelope(result);
    }

    [HttpGet("delivered")]
    public async Task<ActionResult<ApiResponse<PagedResponse<OrderListItemDto>>>> GetDelivered([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.GetDeliveredOrdersAsync(query, cancellationToken);
        return Envelope(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.GetOrderByIdAsync(id, cancellationToken);
        return Envelope(result);
    }

    [HttpPost("{id:guid}/accept")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> Accept(Guid id, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.AcceptOrderAsync(id, cancellationToken);
        return Envelope(result);
    }

    [HttpPost("{id:guid}/mark-picked-up")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> MarkPickedUp(Guid id, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.MarkPickedUpAsync(id, cancellationToken);
        return Envelope(result);
    }

    [HttpPost("{id:guid}/mark-delivered")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> MarkDelivered(Guid id, CancellationToken cancellationToken)
    {
        var result = await _driverOrderService.MarkDeliveredAsync(id, cancellationToken);
        return Envelope(result);
    }
}
