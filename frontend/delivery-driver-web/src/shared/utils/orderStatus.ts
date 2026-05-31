import type { ChipProps } from '@mui/material';
import type { OrderStatus } from '../../entities/order';

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PickedUp':
      return 'Picked up';
    default:
      return status;
  }
}

export function getStatusColor(status: OrderStatus): ChipProps['color'] {
  switch (status) {
    case 'Available':
      return 'info';
    case 'Accepted':
      return 'warning';
    case 'PickedUp':
      return 'secondary';
    case 'Delivered':
      return 'success';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
}
