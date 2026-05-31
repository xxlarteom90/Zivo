import { Box, Card, Divider, List, ListItemButton, ListItemText, Radio, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';

const STORAGE = 'driver.vehicleType';
type Vehicle = 'car' | 'bike' | 'foot';
const OPTIONS: Vehicle[] = ['car', 'bike', 'foot'];

const LEGACY_MAP: Record<string, Vehicle> = {
  'Mașină': 'car',
  Bicicletă: 'bike',
  'Pe jos': 'foot'
};

function readInitial(): Vehicle {
  const raw = localStorage.getItem(STORAGE);
  if (!raw) return 'car';
  if ((OPTIONS as string[]).includes(raw)) return raw as Vehicle;
  return LEGACY_MAP[raw] ?? 'car';
}

export function VehicleSettingsPage() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<Vehicle>(readInitial);
  useEffect(() => { localStorage.setItem(STORAGE, current); }, [current]);

  return (
    <Stack spacing={3}>
      <PageHeader title={t('vehicle.title')} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {OPTIONS.map((opt, idx) => (
            <Box key={opt}>
              <ListItemButton onClick={() => setCurrent(opt)} sx={{ py: 1.5 }}>
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
