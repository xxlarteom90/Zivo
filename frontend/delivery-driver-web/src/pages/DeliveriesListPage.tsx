import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { selectDeliveredOrders } from '../features/orders/orderSelectors';
import { fetchDeliveredOrders } from '../features/orders/orderThunks';
import { PageHeader } from '../shared/components/PageHeader';
import { deriveMetrics, formatKm, formatRon, formatTime } from '../shared/utils/driverMetrics';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function DeliveriesListPage() {
  const dispatch = useAppDispatch();
  const delivered = useAppSelector(selectDeliveredOrders);
  const { t, language } = useTranslation();

  useEffect(() => {
    dispatch(fetchDeliveredOrders({ pageSize: 100, sortBy: 'createdAtUtc', sortDirection: 'desc' }));
  }, [dispatch]);

  const { total, grouped } = useMemo(() => {
    let total = 0;
    const map = new Map<string, { date: Date; items: { order: typeof delivered.items[number]; m: ReturnType<typeof deriveMetrics> }[] }>();
    delivered.items.forEach((o) => {
      const m = deriveMetrics(o);
      total += m.fareRon + m.tipRon;
      const key = `${m.deliveredAt.getFullYear()}-${m.deliveredAt.getMonth()}-${m.deliveredAt.getDate()}`;
      if (!map.has(key)) map.set(key, { date: m.deliveredAt, items: [] });
      map.get(key)!.items.push({ order: o, m });
    });
    map.forEach((g) => g.items.sort((a, b) => b.m.deliveredAt.getTime() - a.m.deliveredAt.getTime()));
    return { total, grouped: Array.from(map.values()).sort((a, b) => b.date.getTime() - a.date.getTime()) };
  }, [delivered.items]);

  const fmtDate = (d: Date) => d.toLocaleDateString(language, { day: 'numeric', month: 'long' });

  return (
    <Stack spacing={3}>
      <PageHeader title={t('deliveries.title')} />

      <Box>
        <Typography variant="overline" color="text.secondary">{t('deliveries.header')}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>{formatRon(total)}</Typography>
      </Box>

      {grouped.length === 0 && (
        <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
          <Typography color="text.secondary">{t('deliveries.empty')}</Typography>
        </Card>
      )}

      {grouped.map((g, gi) => (
        <Box key={gi}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>{fmtDate(g.date)}</Typography>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            {g.items.map(({ order, m }, idx) => (
              <Box key={order.id}>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 700 }}>{order.partnerBusinessName}</Typography>
                    <Typography color="text.secondary" variant="body2">{formatTime(m.deliveredAt)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">{t('deliveries.fee', { km: formatKm(m.distanceKm) })}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatRon(m.fareRon)}</Typography>
                  </Stack>
                  {m.tipRon > 0 && (
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">{t('deliveries.tip')}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatRon(m.tipRon)}</Typography>
                    </Stack>
                  )}
                </Box>
                {idx < g.items.length - 1 && <Divider />}
              </Box>
            ))}
          </Card>
        </Box>
      ))}
    </Stack>
  );
}
