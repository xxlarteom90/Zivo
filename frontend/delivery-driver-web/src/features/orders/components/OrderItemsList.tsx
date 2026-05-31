import InventoryIcon from '@mui/icons-material/Inventory';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import type { OrderItemDto } from '../../../entities/order';

interface OrderItemsListProps {
  items: OrderItemDto[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem key={item.id} disableGutters divider>
          <ListItemIcon sx={{ minWidth: 38 }}>
            <InventoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={`${item.quantity} x ${item.description}`}
            secondary={[item.itemType, item.estimatedWeightKg ? `${item.estimatedWeightKg} kg` : null, item.notes].filter(Boolean).join(' - ')}
          />
        </ListItem>
      ))}
    </List>
  );
}
