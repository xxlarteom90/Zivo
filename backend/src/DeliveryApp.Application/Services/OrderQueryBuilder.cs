using DeliveryApp.Application.Orders;
using DeliveryApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Application.Services;

internal static class OrderQueryBuilder
{
    public static IQueryable<Order> WithOrderGraph(this IQueryable<Order> query) => query
        .Include(order => order.PartnerBusiness)
        .Include(order => order.Customer)
        .Include(order => order.PickupAddress)
        .Include(order => order.DeliveryAddress)
        .Include(order => order.Items)
        .Include(order => order.Assignments)
            .ThenInclude(assignment => assignment.Driver)
                .ThenInclude(driver => driver.User)
        .Include(order => order.StatusHistory)
            .ThenInclude(history => history.ChangedByUser);

    public static IQueryable<Order> ApplyFilters(this IQueryable<Order> query, OrderQueryParameters parameters)
    {
        if (parameters.Status.HasValue)
        {
            query = query.Where(order => order.Status == parameters.Status.Value);
        }

        if (parameters.PartnerBusinessId.HasValue)
        {
            query = query.Where(order => order.PartnerBusinessId == parameters.PartnerBusinessId.Value);
        }

        if (parameters.CustomerId.HasValue)
        {
            query = query.Where(order => order.CustomerId == parameters.CustomerId.Value);
        }

        if (parameters.FromDateUtc.HasValue)
        {
            query = query.Where(order => order.CreatedAtUtc >= parameters.FromDateUtc.Value);
        }

        if (parameters.ToDateUtc.HasValue)
        {
            query = query.Where(order => order.CreatedAtUtc <= parameters.ToDateUtc.Value);
        }

        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var search = parameters.Search.Trim().ToLowerInvariant();
            query = query.Where(order =>
                order.PublicOrderNumber.ToLower().Contains(search) ||
                order.PartnerBusiness.Name.ToLower().Contains(search) ||
                order.Customer.FullName.ToLower().Contains(search) ||
                order.PickupAddress.Line1.ToLower().Contains(search) ||
                order.DeliveryAddress.Line1.ToLower().Contains(search));
        }

        return query;
    }

    public static IQueryable<Order> ApplySorting(this IQueryable<Order> query, OrderQueryParameters parameters)
    {
        var descending = string.Equals(parameters.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);
        var sortBy = parameters.SortBy?.Trim().ToLowerInvariant();

        return sortBy switch
        {
            "createdatutc" => descending ? query.OrderByDescending(order => order.CreatedAtUtc) : query.OrderBy(order => order.CreatedAtUtc),
            "status" => descending ? query.OrderByDescending(order => order.Status) : query.OrderBy(order => order.Status),
            "customer" => descending ? query.OrderByDescending(order => order.Customer.FullName) : query.OrderBy(order => order.Customer.FullName),
            "partner" => descending ? query.OrderByDescending(order => order.PartnerBusiness.Name) : query.OrderBy(order => order.PartnerBusiness.Name),
            _ => descending
                ? query.OrderByDescending(order => order.PickupWindowStartUtc ?? order.CreatedAtUtc)
                : query.OrderBy(order => order.PickupWindowStartUtc ?? order.CreatedAtUtc)
        };
    }
}
