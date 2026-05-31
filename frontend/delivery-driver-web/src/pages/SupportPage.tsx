import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Button, Card, CardActionArea, Divider, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';
import { fetchActiveOrders } from '../features/orders/orderThunks';
import { selectActiveOrders } from '../features/orders/orderSelectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const TOPIC_KEYS = [
  'support.topic.noOrders',
  'support.topic.account',
  'support.topic.payments',
  'support.topic.equipment',
  'support.topic.conversations'
] as const;

export function SupportPage() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectActiveOrders);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchActiveOrders({ pageSize: 5 }));
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <PageHeader title={t('support.title')} />

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography sx={{ fontWeight: 800 }}>{t('support.selectOrder')}</Typography>
          <Button size="small" component={RouterLink} to="/orders/active">{t('support.showMore')}</Button>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
          {active.items.length === 0 && (
            <Card variant="outlined" sx={{ borderRadius: 3, minWidth: 220, p: 2 }}>
              <Typography color="text.secondary">{t('support.noActive')}</Typography>
            </Card>
          )}
          {active.items.map((o) => {
            const code = (o as { code?: string; id?: string }).code ?? o.id;
            const customer = (o as { customerName?: string }).customerName ?? t('support.customer');
            return (
              <Card key={o.id} variant="outlined" sx={{ borderRadius: 3, minWidth: 220, flexShrink: 0 }}>
                <CardActionArea component={RouterLink} to={`/orders/${o.id}`} sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 900 }}>#{String(code).slice(0, 10)}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{customer}</Typography>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>{t('support.otherTopics')}</Typography>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          {TOPIC_KEYS.map((key, idx) => (
            <Box key={key}>
              <CardActionArea sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>{t(key)}</Typography>
                <ChevronRightIcon color="action" />
              </CardActionArea>
              {idx < TOPIC_KEYS.length - 1 && <Divider />}
            </Box>
          ))}
        </Card>
      </Box>
    </Stack>
  );
}
