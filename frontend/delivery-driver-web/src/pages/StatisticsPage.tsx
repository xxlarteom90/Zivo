import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Box, Card, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { selectActiveOrders, selectAvailableOrders, selectDeliveredOrders } from '../features/orders/orderSelectors';
import { fetchActiveOrders, fetchAvailableOrders, fetchDeliveredOrders } from '../features/orders/orderThunks';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function CircleStat({ value, color }: { value: number; color: 'success' | 'warning' | 'error' }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', mx: 'auto', my: 2 }}>
      <CircularProgress variant="determinate" value={100} size={180} thickness={3} sx={{ color: 'divider', position: 'absolute' }} />
      <CircularProgress variant="determinate" value={Math.max(0, Math.min(100, value))} size={180} thickness={3} color={color} />
      <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>{value}%</Typography>
      </Box>
    </Box>
  );
}

export function StatisticsPage() {
  const dispatch = useAppDispatch();
  const delivered = useAppSelector(selectDeliveredOrders);
  const active = useAppSelector(selectActiveOrders);
  const available = useAppSelector(selectAvailableOrders);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchDeliveredOrders({ pageSize: 200, sortBy: 'createdAtUtc', sortDirection: 'desc' }));
    dispatch(fetchActiveOrders({ pageSize: 50 }));
    dispatch(fetchAvailableOrders({ pageSize: 50 }));
  }, [dispatch]);

  const { completed, accepted, completion, missingForLastWeek } = useMemo(() => {
    const completed = delivered.items.length;
    const offered = completed + active.items.length + available.items.length;
    const accepted = offered === 0 ? 0 : Math.round(((completed + active.items.length) / offered) * 100);
    const completion = (completed + active.items.length) === 0
      ? 0
      : Math.round((completed / (completed + active.items.length)) * 100);
    const target = 40;
    const missingForLastWeek = Math.max(0, target - completed);
    return { completed, accepted, completion, missingForLastWeek };
  }, [delivered.items, active.items, available.items]);

  return (
    <Stack spacing={3}>
      <PageHeader title={t('statistics.title')} />

      <Typography>{t('statistics.greeting')}</Typography>
      <Typography variant="body2" color="text.secondary">{t('statistics.hourly')}</Typography>

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>{t('statistics.completedDeliveries')}</Typography>
        <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: 'info.light', color: 'info.contrastText', p: 3 }}>
          <Typography variant="h2" sx={{ fontWeight: 900 }}>{completed}</Typography>
          <Typography sx={{ fontWeight: 700 }}>{t('statistics.completedDeliveries')}</Typography>
        </Card>
        {missingForLastWeek > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'flex-start' }}>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {t('statistics.missingDeliveries', { count: missingForLastWeek })}
            </Typography>
          </Stack>
        )}
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>{t('statistics.acceptedOrders')}</Typography>
        <Stack alignItems="center">
          <CircleStat value={accepted} color={accepted < 50 ? 'error' : accepted < 80 ? 'warning' : 'success'} />
        </Stack>
        {accepted < 50 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'flex-start' }}>
            <ReportProblemOutlinedIcon fontSize="small" color="error" />
            <Typography variant="body2" color="error">{t('statistics.opportunityWarning')}</Typography>
          </Stack>
        )}
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>{t('statistics.completionRate')}</Typography>
        <Stack alignItems="center">
          <CircleStat value={completion} color={completion < 50 ? 'error' : completion < 80 ? 'warning' : 'success'} />
        </Stack>
        {completed === 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'flex-start' }}>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">{t('statistics.noDeliveriesYet')}</Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
