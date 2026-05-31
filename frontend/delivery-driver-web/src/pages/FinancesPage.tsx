import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from '../features/i18n/useTranslation';
import { selectDeliveredOrders } from '../features/orders/orderSelectors';
import { fetchDeliveredOrders } from '../features/orders/orderThunks';
import { PageHeader } from '../shared/components/PageHeader';
import { deriveMetrics, formatRon, formatTime } from '../shared/utils/driverMetrics';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface Tx {
  id: string;
  date: Date;
  labelKey: string;
  sublabel?: string;
  amount: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function FinancesPage() {
  const dispatch = useAppDispatch();
  const delivered = useAppSelector(selectDeliveredOrders);
  const { t, language } = useTranslation();

  useEffect(() => {
    dispatch(fetchDeliveredOrders({ pageSize: 100, sortBy: 'createdAtUtc', sortDirection: 'desc' }));
  }, [dispatch]);

  const { gross, pendingCash, transactions, nextPayoutText } = useMemo(() => {
    const txs: Tx[] = [];
    let gross = 0;
    let pendingCash = 0;
    delivered.items.forEach((o) => {
      const m = deriveMetrics(o);
      const total = m.fareRon + m.tipRon;
      gross += total;
      txs.push({
        id: `inc-${o.id}`,
        date: m.deliveredAt,
        labelKey: 'finances.cashIncome',
        sublabel: o.partnerBusinessName,
        amount: total
      });
      if (m.paymentMethod === 'Cash') {
        const dep = -Math.min(total + 5, 200);
        pendingCash += total;
        txs.push({
          id: `dep-${o.id}`,
          date: new Date(m.deliveredAt.getTime() + 90 * 60 * 1000),
          labelKey: 'finances.cashDeposit',
          amount: dep
        });
        pendingCash += dep;
      }
    });
    txs.sort((a, b) => b.date.getTime() - a.date.getTime());
    const nextPayout = new Date();
    nextPayout.setDate(nextPayout.getDate() + ((5 - nextPayout.getDay() + 7) % 7 || 7));
    const nextPayoutText = `${nextPayout.getDate()} ${MONTHS[nextPayout.getMonth()]}`;
    return { gross, pendingCash: Math.max(0, pendingCash), transactions: txs.slice(0, 30), nextPayoutText };
  }, [delivered.items]);

  const grouped = useMemo(() => {
    const map = new Map<string, { date: Date; items: Tx[] }>();
    transactions.forEach((tx) => {
      const key = `${tx.date.getFullYear()}-${tx.date.getMonth()}-${tx.date.getDate()}`;
      if (!map.has(key)) map.set(key, { date: tx.date, items: [] });
      map.get(key)!.items.push(tx);
    });
    return Array.from(map.values());
  }, [transactions]);

  const fmtLong = (d: Date) =>
    d.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Stack spacing={3}>
      <PageHeader title={t('finances.title')} />

      <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Typography variant="overline" color="text.secondary">{t('finances.grossEarnings')}</Typography>
        <Typography
          component={RouterLink}
          to="/deliveries"
          sx={{ display: 'block', textDecoration: 'none', color: 'inherit', fontSize: 36, fontWeight: 900, mt: 0.5 }}
        >
          {formatRon(gross)}
        </Typography>
        <Typography variant="body2" color="text.secondary">{t('finances.nextPayout', { date: nextPayoutText })}</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="overline" color="text.secondary">{t('finances.pendingCash')}</Typography>
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Stack>
          <Typography sx={{ fontWeight: 700 }}>{formatRon(pendingCash)}</Typography>
        </Stack>
      </Card>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>{t('finances.recent')}</Typography>
        {grouped.length === 0 && (
          <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
            <Typography color="text.secondary">{t('finances.empty')}</Typography>
          </Card>
        )}
        {grouped.map((g, gi) => (
          <Box key={gi} sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>{fmtLong(g.date)}</Typography>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              {g.items.map((tx, idx) => {
                const negative = tx.amount < 0;
                return (
                  <Box key={tx.id}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ p: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{t(tx.labelKey)}</Typography>
                        {tx.sublabel && (
                          <Typography variant="body2" color="text.secondary">{tx.sublabel}</Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">{formatTime(tx.date)}</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: negative ? 'text.primary' : 'success.main' }}>
                        {negative ? '-' : ''}{formatRon(Math.abs(tx.amount))}
                      </Typography>
                    </Stack>
                    {idx < g.items.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Card>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
