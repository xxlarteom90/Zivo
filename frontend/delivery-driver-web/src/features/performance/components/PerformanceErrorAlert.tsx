import { Alert, Button, Stack } from '@mui/material';
import { useTranslation } from '../../i18n/useTranslation';

interface Props {
  message: string;
  onRetry: () => void;
}

export function PerformanceErrorAlert({ message, onRetry }: Props) {
  const { t } = useTranslation();
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      }
    >
      <Stack spacing={0.5}>
        <span>{t('common.error')}</span>
        <span style={{ opacity: 0.85, fontSize: 13 }}>{message}</span>
      </Stack>
    </Alert>
  );
}
