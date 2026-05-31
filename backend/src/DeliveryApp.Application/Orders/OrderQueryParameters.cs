using DeliveryApp.Application.Common;
using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Application.Orders;

public sealed class OrderQueryParameters : PagedRequest
{
    public string? Search { get; set; }
    public OrderStatus? Status { get; set; }
    public Guid? PartnerBusinessId { get; set; }
    public Guid? CustomerId { get; set; }
    public DateTime? FromDateUtc { get; set; }
    public DateTime? ToDateUtc { get; set; }
    public string? SortBy { get; set; } = "pickupWindowStartUtc";
    public string? SortDirection { get; set; } = "asc";
}
