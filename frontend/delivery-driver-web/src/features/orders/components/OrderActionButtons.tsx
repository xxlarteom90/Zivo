import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { Alert, Button, Stack } from '@mui/material';
import type { OrderAction } from '../../../entities/order';
import { useTranslation } from '../../i18n/useTranslation';

interface OrderActionButtonsProps {
  actions: OrderAction[];
  loading?: boolean;
  error?: string | null;
  onAccept?: () => void;
  onMarkPickedUp?: () => void;
  onMarkDelivered?: () => void;
}

export function OrderActionButtons({ actions, loading, error, onAccept, onMarkPickedUp, onMarkDelivered }: OrderActionButtonsProps) {
  const { t } = useTranslation();
  if (actions.length === 0 && !error) return null;

  return (
    <Stack spacing={1.5}>
      {error && <Alert severity="error">{error}</Alert>}
      {actions.includes('Accept') && (
        <Button size="large" fullWidth variant="contained" startIcon={<PlaylistAddCheckIcon />} disabled={loading} onClick={onAccept}>
          {t('order.accept')}
        </Button>
      )}
      {actions.includes('MarkPickedUp') && (
        <Button size="large" fullWidth variant="contained" color="secondary" startIcon={<LocalShippingIcon />} disabled={loading} onClick={onMarkPickedUp}>
          {t('order.markPickedUp')}
        </Button>
      )}
      {actions.includes('MarkDelivered') && (
        <Button size="large" fullWidth variant="contained" color="success" startIcon={<CheckCircleIcon />} disabled={loading} onClick={onMarkDelivered}>
          {t('order.markDelivered')}
        </Button>
      )}
    </Stack>
  );
}
