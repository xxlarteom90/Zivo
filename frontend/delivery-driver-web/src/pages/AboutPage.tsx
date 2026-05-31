import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Card, Divider, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useTranslation } from '../features/i18n/useTranslation';
import { LANGUAGES } from '../features/i18n/languages';
import { PageHeader } from '../shared/components/PageHeader';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ py: 1 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
    </Stack>
  );
}

export function AboutPage() {
  const { t, language } = useTranslation();
  const langLabel = LANGUAGES.find((l) => l.code === language)?.name ?? language;
  return (
    <Stack spacing={3}>
      <PageHeader title={t('about.title')} />
      <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Row label={t('about.appVersion')} value="UI.1.56.HERMES" />
        <Divider />
        <Row label={t('about.updates')} value="--" />
        <Divider />
        <Row label={t('about.cfBundle')} value="2949730.64671707" />
        <Divider />
        <Row label={t('about.localDevice')} value={`${language}-${language.toUpperCase()}`} />
        <Divider />
        <Row label={t('about.appLocal')} value={langLabel} />
        <Divider />
        <Row label="#" value="12232078.876413.802" />
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          <ListItemButton sx={{ py: 1.5 }}>
            <ListItemText primary={t('about.privacy')} />
            <ChevronRightIcon color="action" />
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton sx={{ py: 1.5 }}>
            <ListItemText primary={t('about.licenses')} />
            <ChevronRightIcon color="action" />
          </ListItemButton>
        </List>
      </Card>

      <Box sx={{ height: 24 }} />
    </Stack>
  );
}
