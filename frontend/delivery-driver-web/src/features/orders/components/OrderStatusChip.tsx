import { Chip } from '@mui/material';
import type { OrderStatus } from '../../../entities/order';
import { getStatusColor, getStatusLabel } from '../../../shared/utils/orderStatus';

interface OrderStatusChipProps {
  status: OrderStatus;
}

export function OrderStatusChip({ status }: OrderStatusChipProps) {
  return <Chip size="small" color={getStatusColor(status)} label={getStatusLabel(status)} sx={{ fontWeight: 700 }} />;
}
