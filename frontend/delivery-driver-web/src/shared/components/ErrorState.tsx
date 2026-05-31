import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Button, Stack } from '@mui/material';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Stack spacing={2} sx={{ my: 3 }}>
      <Alert severity="error">{message}</Alert>
      {onRetry && (
        <Button startIcon={<RefreshIcon />} variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Stack>
  );
}
