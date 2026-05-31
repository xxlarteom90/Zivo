import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { Box, Button, Card, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';

type Vote = 'up' | 'down' | null;
type SectionKey = 'app' | 'locations' | 'support';

function VotePair({ value, onChange }: { value: Vote; onChange: (v: Vote) => void }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <Button
        fullWidth variant="outlined" color={value === 'up' ? 'success' : 'inherit'}
        onClick={() => onChange(value === 'up' ? null : 'up')}
        sx={{ borderRadius: 999, py: 1.2 }}
        startIcon={value === 'up' ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
      >&nbsp;</Button>
      <Button
        fullWidth variant="outlined" color={value === 'down' ? 'error' : 'inherit'}
        onClick={() => onChange(value === 'down' ? null : 'down')}
        sx={{ borderRadius: 999, py: 1.2 }}
        startIcon={value === 'down' ? <ThumbDownAltIcon /> : <ThumbDownAltOutlinedIcon />}
      >&nbsp;</Button>
    </Stack>
  );
}

export function FeedbackPage() {
  const { t } = useTranslation();
  const [votes, setVotes] = useState<Record<SectionKey, Vote>>({ app: null, locations: null, support: null });
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sections: { key: SectionKey; title: string; desc: string }[] = [
    { key: 'app', title: t('feedback.topic.app.title'), desc: t('feedback.topic.app.desc') },
    { key: 'locations', title: t('feedback.topic.locations.title'), desc: t('feedback.topic.locations.desc') },
    { key: 'support', title: t('feedback.topic.support.title'), desc: t('feedback.topic.support.desc') }
  ];

  const canSubmit = Object.values(votes).some(Boolean) || comment.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setVotes({ app: null, locations: null, support: null });
    setComment('');
    setShowComment(false);
  };

  return (
    <Stack spacing={3}>
      <PageHeader title={t('feedback.title')} />
      {sections.map((s) => (
        <Card key={s.key} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
          <Typography align="center" sx={{ fontWeight: 800 }}>{s.title}</Typography>
          <Typography align="center" color="text.secondary" variant="body2" sx={{ mt: 1 }}>{s.desc}</Typography>
          <VotePair value={votes[s.key]} onChange={(v) => setVotes((prev) => ({ ...prev, [s.key]: v }))} />
        </Card>
      ))}

      {showComment ? (
        <TextField
          label={t('feedback.commentLabel')}
          multiline minRows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      ) : (
        <Button variant="outlined" sx={{ borderRadius: 999, py: 1.4 }} onClick={() => setShowComment(true)}>
          {t('feedback.addComment')}
        </Button>
      )}

      <Button variant="contained" sx={{ borderRadius: 999, py: 1.4 }} disabled={!canSubmit} onClick={submit}>
        {t('feedback.submit')}
      </Button>

      <Box sx={{ height: 24 }} />
      <Snackbar open={submitted} autoHideDuration={2500} onClose={() => setSubmitted(false)} message={t('feedback.thanks')} />
    </Stack>
  );
}
