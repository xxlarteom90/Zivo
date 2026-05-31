using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.Performance;
using DeliveryApp.Domain.Entities;
using DeliveryApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Application.Services;

public sealed class DriverPerformanceService : IDriverPerformanceService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IUserContext _userContext;
    private readonly IDateTimeProvider _dateTimeProvider;

    public DriverPerformanceService(
        IApplicationDbContext dbContext,
        IUserContext userContext,
        IDateTimeProvider dateTimeProvider)
    {
        _dbContext = dbContext;
        _userContext = userContext;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<DriverPerformanceDto> GetPerformanceAsync(PerformancePeriod period, CancellationToken cancellationToken = default)
    {
        if (!_userContext.IsAuthenticated)
        {
            throw new AuthenticationAppException();
        }

        var driver = await _dbContext.DriverProfiles
            .SingleOrDefaultAsync(profile => profile.UserId == _userContext.UserId, cancellationToken)
            ?? throw new ForbiddenAppException("The current user does not have a driver profile.");

        var (fromUtc, toUtc) = ResolveWindow(period, _dateTimeProvider.UtcNow);

        // Assignments accepted in window = "accepted" count.
        var acceptedAssignments = await _dbContext.OrderAssignments
            .AsNoTracking()
            .Where(a => a.DriverId == driver.Id
                && a.AcceptedAtUtc >= fromUtc
                && a.AcceptedAtUtc < toUtc)
            .Select(a => new { a.OrderId, a.AcceptedAtUtc, a.DeliveredAtUtc })
            .ToListAsync(cancellationToken);

        // Delivered orders in window = orders the driver actually completed.
        var deliveredOrders = await _dbContext.Orders
            .AsNoTracking()
            .Where(o => o.Status == OrderStatus.Delivered
                && o.DeliveredAtUtc != null
                && o.DeliveredAtUtc >= fromUtc
                && o.DeliveredAtUtc < toUtc
                && o.Assignments.Any(a => a.DriverId == driver.Id))
            .Select(o => new { o.Id })
            .ToListAsync(cancellationToken);

        // "Offered" = available orders shown in the window. We approximate this with
        // (accepted + available offers currently visible), keeping it deterministic.
        var availableInWindow = await _dbContext.Orders
            .AsNoTracking()
            .Where(o => o.CreatedAtUtc >= fromUtc && o.CreatedAtUtc < toUtc)
            .CountAsync(cancellationToken);

        var acceptedCount = acceptedAssignments.Count;
        var offeredCount = Math.Max(acceptedCount, availableInWindow);
        var deliveriesCount = deliveredOrders.Count;

        decimal totalEarnings = 0m;
        decimal tips = 0m;
        decimal distance = 0m;
        decimal cashCollected = 0m;
        decimal cashDelivered = 0m;

        foreach (var order in deliveredOrders)
        {
            var metrics = DeriveMetrics(order.Id);
            totalEarnings += metrics.FareRon + metrics.TipRon;
            tips += metrics.TipRon;
            distance += metrics.DistanceKm;
            if (metrics.IsCash)
            {
                cashCollected += metrics.FareRon + metrics.TipRon;
            }
            else
            {
                cashDelivered += metrics.FareRon * 0.05m; // small cash drop-off simulation
            }
        }

        var acceptanceRate = offeredCount == 0 ? 0 : (int)Math.Round(acceptedCount * 100.0 / offeredCount);
        var completionRate = acceptedCount == 0 ? 0 : (int)Math.Round(deliveriesCount * 100.0 / acceptedCount);
        var avgFare = deliveriesCount == 0 ? 0m : Math.Round(totalEarnings / deliveriesCount, 2);

        return new DriverPerformanceDto(
            period,
            fromUtc,
            toUtc,
            Math.Clamp(acceptanceRate, 0, 100),
            Math.Clamp(completionRate, 0, 100),
            deliveriesCount,
            acceptedCount,
            offeredCount,
            Math.Round(totalEarnings, 2),
            Math.Round(cashCollected, 2),
            Math.Round(cashDelivered, 2),
            Math.Round(cashCollected - cashDelivered, 2),
            Math.Round(tips, 2),
            Math.Round(distance, 2),
            avgFare);
    }

    private static (DateTime fromUtc, DateTime toUtc) ResolveWindow(PerformancePeriod period, DateTime nowUtc)
    {
        var endExclusive = nowUtc.AddSeconds(1);
        return period switch
        {
            PerformancePeriod.Today => (nowUtc.Date, endExclusive),
            PerformancePeriod.Week => (nowUtc.Date.AddDays(-6), endExclusive),
            PerformancePeriod.Month => (nowUtc.Date.AddDays(-29), endExclusive),
            _ => (nowUtc.Date, endExclusive)
        };
    }

    // Deterministic metrics from order id — mirrors the frontend deriveMetrics util
    // so values are stable and consistent across UI and API.
    private static OrderMetrics DeriveMetrics(Guid orderId)
    {
        uint hash = 2166136261u;
        var s = orderId.ToString("N");
        foreach (var c in s)
        {
            hash ^= c;
            hash *= 16777619u;
        }

        var distance = 1 + (decimal)(hash % 1200u) / 100m; // 1.0 – 13.0 km
        var fare = 8m + (decimal)((hash >> 8) % 2500u) / 100m; // 8.00 – 33.00 RON
        var tipBuckets = new[] { 0m, 0m, 0m, 4m, 5m, 10m };
        var tip = tipBuckets[(hash >> 4) % (uint)tipBuckets.Length];
        var isCash = ((hash >> 12) & 1u) == 1u;

        return new OrderMetrics(distance, fare, tip, isCash);
    }

    private readonly record struct OrderMetrics(decimal DistanceKm, decimal FareRon, decimal TipRon, bool IsCash);
}
