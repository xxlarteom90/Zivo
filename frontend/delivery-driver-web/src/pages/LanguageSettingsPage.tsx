import { Box, Card, Divider, List, ListItemButton, ListItemText, Radio, Snackbar, Stack } from '@mui/material';
import { useState } from 'react';
import { selectLanguage } from '../features/i18n/i18nSlice';
import { LANGUAGES, type LanguageCode } from '../features/i18n/languages';
import { useTranslation } from '../features/i18n/useTranslation';
import { savePreferences } from '../features/preferences/preferencesSlice';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function LanguageSettingsPage() {
  const current = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (code: LanguageCode) => {
    if (code === current) return;
    dispatch(savePreferences({ language: code }));
    setOpen(true);
  };

  return (
    <Stack spacing={3}>
      <PageHeader title={t('language.title')} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {LANGUAGES.map((lang, idx) => (
            <Box key={lang.code}>
              <ListItemButton onClick={() => handleSelect(lang.code)} sx={{ py: 1.5 }}>
                <ListItemText primary={lang.name} />
                <Radio checked={current === lang.code} color="success" />
              </ListItemButton>
              {idx < LANGUAGES.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message={t('snack.languageChanged')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  );
}
