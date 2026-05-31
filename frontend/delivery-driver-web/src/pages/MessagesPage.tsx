import { Box, Card, CardActionArea, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';

interface Message {
  id: string;
  title: string;
  preview?: string;
  date: string;
  emoji?: string;
}

const MESSAGES: Message[] = [
  { id: '1', title: 'News and Updates menu', date: '06.02.2026' },
  { id: '2', title: 'Hygiene rules for delivery', preview: 'Read more here', date: '04.02.2026' },
  { id: '3', title: 'Increased payment!', preview: 'Read more', date: '26.01.2026', emoji: '💸' },
  { id: '4', title: 'Increased payment!', preview: 'Read more', date: '16.01.2026', emoji: '💸' },
  { id: '5', title: 'Increased payment!', preview: 'Read more', date: '15.01.2026', emoji: '💸' },
  { id: '6', title: 'Secure screenshot mode now available in the app', date: '10.01.2026' }
];

export function MessagesPage() {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <PageHeader title={t('messages.title')} subtitle={t('messages.subtitle')} />
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        {MESSAGES.map((m, idx) => (
          <Box key={m.id}>
            <CardActionArea sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 800 }}>
                {m.emoji ? `${m.emoji} ` : ''}{m.title}
              </Typography>
              {m.preview && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {m.preview}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>{m.date}</Typography>
            </CardActionArea>
            {idx < MESSAGES.length - 1 && <Divider />}
          </Box>
        ))}
      </Card>
    </Stack>
  );
}
