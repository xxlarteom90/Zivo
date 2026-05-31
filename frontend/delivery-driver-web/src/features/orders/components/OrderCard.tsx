import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Button, Card, CardActionArea, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { OrderListItemDto } from '../../../entities/order';
import { formatTimeWindow } from '../../../shared/utils/dateFormat';
import { useTranslation } from '../../i18n/useTranslation';
import { OrderStatusChip } from './OrderStatusChip';

interface OrderCardProps {
  order: OrderListItemDto;
  primaryActionLabel?: string;
  primaryActionLoading?: boolean;
  onPrimaryAction?: (orderId: string) => void;
}

export function OrderCard({ order, primaryActionLabel, primaryActionLoading, onPrimaryAction }: OrderCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardActionArea onClick={() => navigate(`/orders/${order.id}`)}>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {order.publicOrderNumber}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {order.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.partnerBusinessName}
                </Typography>
              </Box>
              <OrderStatusChip status={order.status} />
            </Stack>

            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2">{formatTimeWindow(order.pickupWindowStartUtc, order.pickupWindowEndUtc)}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <LocationOnIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('order.pickup')}</Typography>
                  <Typography variant="body2" color="text.secondary">{order.pickupAddressSummary}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <LocationOnIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('order.delivery')}</Typography>
                  <Typography variant="body2" color="text.secondary">{order.deliveryAddressSummary}</Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                {order.itemSummary}{order.hasSpecialInstructions ? ` ${t('order.specialInstructions')}` : ''}
              </Typography>
              <ArrowForwardIcon color="action" />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      {primaryActionLabel && onPrimaryAction && (
        <Box sx={{ p: 1.5, pt: 0 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={primaryActionLoading}
            onClick={(event) => {
              event.stopPropagation();
              onPrimaryAction(order.id);
            }}
          >
            {primaryActionLabel}
          </Button>
        </Box>
      )}
    </Card>
  );
}
