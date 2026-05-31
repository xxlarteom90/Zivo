import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Card, Snackbar, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { selectCurrentUser } from '../features/auth/authSelectors';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppSelector } from '../store/hooks';

export function ReferralsPage() {
  const user = useAppSelector(selectCurrentUser);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const code = useMemo(() => {
    const base = (user?.fullName ?? 'driver').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'CRRR';
    const id = ((user as { id?: string } | null)?.id ?? '00000000').replace(/[^0-9a-f]/gi, '').slice(0, 4).toUpperCase();
    return `${base}${id}`;
  }, [user]);

  const STEPS = [
    { n: 1, title: t('referrals.step1.title'), desc: t('referrals.step1.desc') },
    { n: 2, title: t('referrals.step2.title'), desc: t('referrals.step2.desc') },
    { n: 3, title: t('referrals.step3.title'), desc: t('referrals.step3.desc') }
  ];

  const FAQS = [
    { q: t('referrals.faq1.q'), a: t('referrals.faq1.a') },
    { q: t('referrals.faq2.q'), a: t('referrals.faq2.a') },
    { q: t('referrals.faq3.q'), a: t('referrals.faq3.a') },
    { q: t('referrals.faq4.q'), a: t('referrals.faq4.a') },
    { q: t('referrals.faq5.q'), a: t('referrals.faq5.a') }
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
    setCopied(true);
  };

  return (
    <Stack spacing={3}>
      <PageHeader title={t('referrals.title')} />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>{t('referrals.headline')}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{t('referrals.subtitle')}</Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: 'info.light', height: 220, display: 'grid', placeItems: 'center' }}>
        <Avatar sx={{ width: 96, height: 96, fontSize: 48, bgcolor: 'background.paper' }}>🦌</Avatar>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="overline" color="text.secondary">{t('referrals.yourCode')}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1 }}>{code}</Typography>
          </Box>
          <Button variant="contained" onClick={copy}>{t('common.copy')}</Button>
        </Stack>
      </Card>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>{t('referrals.howItWorks')}</Typography>
        <Stack spacing={2}>
          {STEPS.map((s) => (
            <Stack key={s.n} direction="row" spacing={2}>
              <Avatar sx={{ bgcolor: 'info.light', color: 'info.contrastText', fontWeight: 900 }}>{s.n}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800 }}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="overline" sx={{ fontWeight: 900 }}>{t('referrals.faq')}</Typography>
        {FAQS.map((f) => (
          <Accordion key={f.q} elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: 1, borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>{f.q}</Typography></AccordionSummary>
            <AccordionDetails><Typography variant="body2" color="text.secondary">{f.a}</Typography></AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Button variant="text">{t('common.terms')}</Button>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message={t('snack.codeCopied')} />
    </Stack>
  );
}
