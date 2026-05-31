import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack minHeight="100vh" alignItems="center" justifyContent="center" spacing={2} sx={{ px: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 900 }}>Page not found</Typography>
      <Typography color="text.secondary">The page you requested does not exist.</Typography>
      <Button component={RouterLink} to="/" variant="contained">Go to dashboard</Button>
    </Stack>
  );
}
