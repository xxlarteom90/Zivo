namespace DeliveryApp.Application.Performance;

public enum PerformancePeriod
{
    Today = 0,
    Week = 1,
    Month = 2
}

public sealed record DriverPerformanceDto(
    PerformancePeriod Period,
    DateTime FromUtc,
    DateTime ToUtc,
    int AcceptanceRatePercent,
    int CompletionRatePercent,
    int DeliveriesCount,
    int AcceptedCount,
    int OfferedCount,
    decimal TotalEarningsRon,
    decimal CashCollectedRon,
    decimal CashDeliveredRon,
    decimal CashBalanceRon,
    decimal TipsRon,
    decimal DistanceKm,
    decimal AverageFarePerDeliveryRon);

public sealed record PerformanceQueryDto(PerformancePeriod Period = PerformancePeriod.Today);
