import { Box, Card, Divider, List, ListItemButton, ListItemText, Radio, Stack } from '@mui/material';
import { useTranslation } from '../features/i18n/useTranslation';
import { savePreferences, selectVehicleType, type Vehicle } from '../features/preferences/preferencesSlice';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const OPTIONS: Vehicle[] = ['car', 'bike', 'foot'];

export function VehicleSettingsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectVehicleType);

  const select = (value: Vehicle) => {
    if (value === current) return;
    dispatch(savePreferences({ vehicleType: value }));
  };

  return (
    <Stack spacing={3}>
      <PageHeader title={t('vehicle.title')} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {OPTIONS.map((opt, idx) => (
            <Box key={opt}>
              <ListItemButton onClick={() => select(opt)} sx={{ py: 1.5 }}>
                <ListItemText primary={t(`vehicle.${opt}`)} />
                <Radio checked={current === opt} color="success" />
              </ListItemButton>
              {idx < OPTIONS.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Card>
    </Stack>
  );
}
