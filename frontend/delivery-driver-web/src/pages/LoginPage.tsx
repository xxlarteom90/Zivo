import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Alert, Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../features/auth/authSelectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [email, setEmail] = useState('driver1@example.com');
  const [password, setPassword] = useState('Password123!');

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', px: 2 }}>
      <Container maxWidth="xs">
        <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: 64, height: 64, display: 'grid', placeItems: 'center', borderRadius: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <LocalShippingIcon fontSize="large" />
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 900 }}>DeliveryApp</Typography>
            <Typography color="text.secondary">Driver delivery management</Typography>
          </Box>
        </Stack>
        <Card variant="outlined" sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
              <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              <Typography variant="caption" color="text.secondary">
                Demo driver: driver1@example.com / Password123!
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
