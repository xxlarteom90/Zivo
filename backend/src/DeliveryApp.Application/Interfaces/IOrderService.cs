using DeliveryApp.Application.Common;
using DeliveryApp.Application.Orders;

namespace DeliveryApp.Application.Interfaces;

public interface IOrderService
{
    Task<PagedResponse<OrderListItemDto>> GetOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> GetOrderByIdAsync(Guid orderId, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> CreateOrderAsync(CreateOrderRequestDto request, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> CancelOrderAsync(Guid orderId, CancelOrderRequestDto request, CancellationToken cancellationToken = default);
}
