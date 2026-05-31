import { Box, Card, Divider, FormControlLabel, List, ListItemButton, ListItemText, Radio, Stack, Switch, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';

const APPEARANCE_STORAGE = 'driver.appearance';
const REDUCED_MOTION_STORAGE = 'driver.reducedMotion';

type Appearance = 'system' | 'light' | 'dark';

export function AppearanceSettingsPage() {
  const { t } = useTranslation();
  const [appearance, setAppearance] = useState<Appearance>(() => (localStorage.getItem(APPEARANCE_STORAGE) as Appearance) || 'system');
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => localStorage.getItem(REDUCED_MOTION_STORAGE) === '1');

  useEffect(() => { localStorage.setItem(APPEARANCE_STORAGE, appearance); }, [appearance]);
  useEffect(() => { localStorage.setItem(REDUCED_MOTION_STORAGE, reducedMotion ? '1' : '0'); }, [reducedMotion]);

  const options: { value: Appearance; label: string }[] = [
    { value: 'system', label: t('appearance.system') },
    { value: 'light', label: t('appearance.light') },
    { value: 'dark', label: t('appearance.dark') }
  ];

  return (
    <Stack spacing={3}>
      <PageHeader title={t('appearance.title')} />

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>{t('appearance.title')}</Typography>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <List disablePadding>
            {options.map((opt, idx) => (
              <Box key={opt.value}>
                <ListItemButton onClick={() => setAppearance(opt.value)} sx={{ py: 1.5 }}>
                  <ListItemText primary={opt.label} />
                  <Radio checked={appearance === opt.value} color="success" />
                </ListItemButton>
                {idx < options.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        </Card>
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>{t('appearance.animations')}</Typography>
        <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
          <FormControlLabel
            control={<Switch checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />}
            label={
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{t('appearance.reduce')}</Typography>
                <Typography variant="body2" color="text.secondary">{t('appearance.reduceDesc')}</Typography>
              </Box>
            }
            labelPlacement="start"
            sx={{ ml: 0, justifyContent: 'space-between', width: '100%' }}
          />
        </Card>
      </Box>
    </Stack>
  );
}
