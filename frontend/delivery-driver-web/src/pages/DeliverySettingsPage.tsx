import BarChartIcon from '@mui/icons-material/BarChart';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';

export function DeliverySettingsPage() {
  const { t } = useTranslation();
  return (
    <Stack spacing={3}>
      <PageHeader title={t('deliverySettings.title')} />

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <LocationOnOutlinedIcon />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{t('deliverySettings.zone')}</Typography>
              <Typography color="text.secondary" variant="body2">{t('deliverySettings.city')}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'warning.main' }}>
            <BarChartIcon fontSize="small" />
            <Typography sx={{ fontWeight: 700 }}>{t('deliverySettings.demandMedium')}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">
            {t('deliverySettings.demandDesc')}
          </Typography>
        </Box>
      </Card>
    </Stack>
  );
}
