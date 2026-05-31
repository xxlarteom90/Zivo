export type PerformancePeriod = 'Today' | 'Week' | 'Month';

export interface DriverPerformanceDto {
  period: PerformancePeriod;
  fromUtc: string;
  toUtc: string;
  acceptanceRatePercent: number;
  completionRatePercent: number;
  deliveriesCount: number;
  acceptedCount: number;
  offeredCount: number;
  totalEarningsRon: number;
  cashCollectedRon: number;
  cashDeliveredRon: number;
  cashBalanceRon: number;
  tipsRon: number;
  distanceKm: number;
  averageFarePerDeliveryRon: number;
}
