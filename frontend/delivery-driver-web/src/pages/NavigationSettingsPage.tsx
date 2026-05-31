import { Box, Card, Divider, List, ListItemButton, ListItemText, Radio, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';

const OPTIONS = ['Waze', 'Google Maps', 'Apple Maps'] as const;
type NavApp = (typeof OPTIONS)[number];
const STORAGE = 'driver.navApp';

export function NavigationSettingsPage() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<NavApp>(() => (localStorage.getItem(STORAGE) as NavApp) || 'Google Maps');

  useEffect(() => {
    localStorage.setItem(STORAGE, current);
  }, [current]);

  return (
    <Stack spacing={3}>
      <PageHeader title={t('navSettings.title')} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {OPTIONS.map((opt, idx) => (
            <Box key={opt}>
              <ListItemButton onClick={() => setCurrent(opt)} sx={{ py: 1.5 }}>
                <ListItemText primary={opt} />
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
