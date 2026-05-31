import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { Alert, Button, Stack } from '@mui/material';
import type { OrderAction } from '../../../entities/order';

interface OrderActionButtonsProps {
  actions: OrderAction[];
  loading?: boolean;
  error?: string | null;
  onAccept?: () => void;
  onMarkPickedUp?: () => void;
  onMarkDelivered?: () => void;
}

export function OrderActionButtons({ actions, loading, error, onAccept, onMarkPickedUp, onMarkDelivered }: OrderActionButtonsProps) {
  if (actions.length === 0 && !error) return null;

  return (
    <Stack spacing={1.5}>
      {error && <Alert severity="error">{error}</Alert>}
      {actions.includes('Accept') && (
        <Button size="large" fullWidth variant="contained" startIcon={<PlaylistAddCheckIcon />} disabled={loading} onClick={onAccept}>
          Accept order
        </Button>
      )}
      {actions.includes('MarkPickedUp') && (
        <Button size="large" fullWidth variant="contained" color="secondary" startIcon={<LocalShippingIcon />} disabled={loading} onClick={onMarkPickedUp}>
          Mark picked up
        </Button>
      )}
      {actions.includes('MarkDelivered') && (
        <Button size="large" fullWidth variant="contained" color="success" startIcon={<CheckCircleIcon />} disabled={loading} onClick={onMarkDelivered}>
          Mark delivered
        </Button>
      )}
    </Stack>
  );
}
