import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { PerformanceErrorAlert } from '../features/performance/components/PerformanceErrorAlert';
import { PeriodTabs } from '../features/performance/components/PeriodTabs';
import { StatCard } from '../features/performance/components/StatCard';
import {
  fetchPerformance,
  selectPerformanceData,
  selectPerformanceError,
  selectPerformanceLoading,
  selectPerformancePeriod,
  setPeriod
} from '../features/performance/performanceSlice';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const numberFormat = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const integerFormat = new Intl.NumberFormat('ro-RO');

function formatRon(value: number): string {
  return `${numberFormat.format(value)} RON`;
}

function formatKm(value: number): string {
  return numberFormat.format(value);
}

export function PerformancePage() {
  const dispatch = useAppDispatch();
  const period = useAppSelector(selectPerformancePeriod);
  const data = useAppSelector(selectPerformanceData);
  const loading = useAppSelector(selectPerformanceLoading);
  const error = useAppSelector(selectPerformanceError);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchPerformance(period));
  }, [dispatch, period]);

  return (
    <Stack spacing={3}>
      <PageHeader
        title={t('performance.title')}
        subtitle={t('performance.subtitle')}
        action={
          <IconButton
            onClick={() => dispatch(fetchPerformance(period))}
            aria-label={t('performance.refresh')}
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
        }
      />

      <PeriodTabs value={period} onChange={(p) => dispatch(setPeriod(p))} />

      {error && (
        <PerformanceErrorAlert message={error} onRetry={() => dispatch(fetchPerformance(period))} />
      )}

      <Stack spacing={2}>
        <StatCard
          loading={loading && !data}
          value={`${data?.acceptanceRatePercent ?? 0}%`}
          title={t('performance.acceptanceRate')}
          subtitle={t('performance.acceptanceRate.sub')}
        />
        <StatCard
          loading={loading && !data}
          value={integerFormat.format(data?.deliveriesCount ?? 0)}
          title={t('performance.deliveries')}
          subtitle={t('performance.deliveries.sub')}
        />
        <StatCard
          loading={loading && !data}
          value={formatRon(data?.totalEarningsRon ?? 0)}
          title={t('performance.totalNet')}
          subtitle={t('performance.totalNet.sub')}
        />
        <StatCard
          loading={loading && !data}
          value={formatRon(data?.cashBalanceRon ?? 0)}
          title={t('performance.cash')}
          subtitle={t('performance.cash.sub')}
        />
        <StatCard
          loading={loading && !data}
          value={formatKm(data?.distanceKm ?? 0)}
          title={t('performance.distance')}
          subtitle={t('performance.distance.sub')}
        />
        <StatCard
          loading={loading && !data}
          value={`${data?.completionRatePercent ?? 0}%`}
          title={t('performance.completionRate')}
        />
        <StatCard
          loading={loading && !data}
          value={formatRon(data?.tipsRon ?? 0)}
          title={t('performance.tips')}
        />
        <StatCard
          loading={loading && !data}
          value={formatRon(data?.averageFarePerDeliveryRon ?? 0)}
          title={t('performance.avgFare')}
        />
      </Stack>
    </Stack>
  );
}
