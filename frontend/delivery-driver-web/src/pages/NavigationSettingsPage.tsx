import { Box, Card, Divider, List, ListItemButton, ListItemText, Radio, Stack } from '@mui/material';
import { useTranslation } from '../features/i18n/useTranslation';
import { savePreferences, selectNavigationApp, type NavApp } from '../features/preferences/preferencesSlice';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const OPTIONS: NavApp[] = ['Waze', 'Google Maps', 'Apple Maps'];

export function NavigationSettingsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectNavigationApp);

  const select = (value: NavApp) => {
    if (value === current) return;
    dispatch(savePreferences({ navigationApp: value }));
  };

  return (
    <Stack spacing={3}>
      <PageHeader title={t('navSettings.title')} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {OPTIONS.map((opt, idx) => (
            <Box key={opt}>
              <ListItemButton onClick={() => select(opt)} sx={{ py: 1.5 }}>
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
