using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryApp.Api.Controllers;

[Authorize(Roles = ApiRoles.DispatcherOrAdmin)]
[Route("api/orders")]
public sealed class OrdersController : ApiControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<OrderListItemDto>>>> GetOrders([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var result = await _orderService.GetOrdersAsync(query, cancellationToken);
        return Envelope(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _orderService.GetOrderByIdAsync(id, cancellationToken);
        return Envelope(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> Create(CreateOrderRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _orderService.CreateOrderAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<OrderDetailsDto>.Success(result, HttpContext.TraceIdentifier));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> Update(Guid id, UpdateOrderRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _orderService.UpdateOrderAsync(id, request, cancellationToken);
        return Envelope(result);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> Cancel(Guid id, CancelOrderRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _orderService.CancelOrderAsync(id, request, cancellationToken);
        return Envelope(result);
    }

    [HttpGet("{id:guid}/history")]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<OrderStatusHistoryDto>>>> GetHistory(Guid id, CancellationToken cancellationToken)
    {
        var result = await _orderService.GetOrderByIdAsync(id, cancellationToken);
        return Envelope(result.StatusHistory);
    }
}
