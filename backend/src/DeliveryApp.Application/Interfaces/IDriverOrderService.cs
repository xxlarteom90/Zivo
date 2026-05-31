using DeliveryApp.Application.Common;
using DeliveryApp.Application.Orders;

namespace DeliveryApp.Application.Interfaces;

public interface IDriverOrderService
{
    Task<PagedResponse<OrderListItemDto>> GetAvailableOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default);
    Task<PagedResponse<OrderListItemDto>> GetActiveOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default);
    Task<PagedResponse<OrderListItemDto>> GetDeliveredOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> GetOrderByIdAsync(Guid orderId, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> AcceptOrderAsync(Guid orderId, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> MarkPickedUpAsync(Guid orderId, CancellationToken cancellationToken = default);
    Task<OrderDetailsDto> MarkDeliveredAsync(Guid orderId, CancellationToken cancellationToken = default);
}
