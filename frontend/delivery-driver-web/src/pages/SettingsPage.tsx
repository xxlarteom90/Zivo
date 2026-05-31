import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Button, Card, Divider, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { LANGUAGES } from '../features/i18n/languages';
import { selectLanguage } from '../features/i18n/i18nSlice';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface RowProps { label: string; value?: string; to?: string }
function Row({ label, value, to }: RowProps) {
  const inner = (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, px: 2, width: '100%' }}>
      <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        {value && <Typography color="text.secondary">{value}</Typography>}
        <ChevronRightIcon color="action" />
      </Stack>
    </Stack>
  );
  if (to) return <ListItemButton component={RouterLink} to={to} sx={{ p: 0 }}>{inner}</ListItemButton>;
  return <ListItemButton sx={{ p: 0 }}>{inner}</ListItemButton>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 800, mb: 1 }}>{title}</Typography>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>{children}</List>
      </Card>
    </Box>
  );
}

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const language = useAppSelector(selectLanguage);
  const { t } = useTranslation();
  const [navApp] = useState<string>(() => localStorage.getItem('driver.navApp') || 'Google Maps');
  const [vehicle] = useState<string>(() => localStorage.getItem('driver.vehicleType') || 'Car');

  const languageName = LANGUAGES.find((l) => l.code === language)?.name ?? language;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <Stack spacing={3}>
      <PageHeader title={t('settings.title')} />

      <Section title={t('settings.section.navigation')}>
        <Row label={t('settings.navApp')} value={navApp} to="/settings/navigation" />
        <Divider component="li" />
        <Row label={t('settings.vehicle')} value={vehicle} to="/settings/vehicle" />
      </Section>

      <Section title={t('settings.section.display')}>
        <Row label={t('settings.appearance')} to="/settings/appearance" />
        <Divider component="li" />
        <Row label={t('settings.weekStart')} />
        <Divider component="li" />
        <Row label={t('settings.orderSound')} />
      </Section>

      <Section title={t('settings.section.communication')}>
        <Row label={t('settings.feedback')} to="/feedback" />
      </Section>

      <Section title={t('settings.section.language')}>
        <Row label={t('settings.language')} value={languageName} to="/settings/language" />
      </Section>

      <Section title={t('settings.section.account')}>
        <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemText primary={t('settings.logout')} primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }} />
        </ListItemButton>
        <Divider component="li" />
        <Row label={t('settings.privacy')} />
      </Section>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Button color="inherit" size="small" component={RouterLink} to="/about">{t('settings.about')}</Button>
      </Box>
    </Stack>
  );
}
