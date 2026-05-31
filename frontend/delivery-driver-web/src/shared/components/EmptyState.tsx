import InboxIcon from '@mui/icons-material/Inbox';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box sx={{ py: 7, px: 2, textAlign: 'center', color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: 52, mb: 1 }} />
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {description && <Typography sx={{ mt: 1 }}>{description}</Typography>}
    </Box>
  );
}
