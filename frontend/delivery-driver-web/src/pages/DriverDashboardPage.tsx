import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchActiveOrders, fetchAvailableOrders, fetchDeliveredOrders } from '../features/orders/orderThunks';
import { selectActiveOrders, selectAvailableOrders, selectDeliveredOrders } from '../features/orders/orderSelectors';
import { OrderCard } from '../features/orders/components/OrderCard';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function MetricCard({ title, value, icon, to }: { title: string; value: number; icon: JSX.Element; to: string }) {
  return (
    <Card component={RouterLink} to={to} variant="outlined" sx={{ p: 2, textDecoration: 'none', color: 'inherit', borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>{value}</Typography>
          <Typography color="text.secondary">{title}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export function DriverDashboardPage() {
  const dispatch = useAppDispatch();
  const available = useAppSelector(selectAvailableOrders);
  const active = useAppSelector(selectActiveOrders);
  const delivered = useAppSelector(selectDeliveredOrders);

  useEffect(() => {
    dispatch(fetchAvailableOrders({ pageSize: 5 }));
    dispatch(fetchActiveOrders({ pageSize: 5 }));
    dispatch(fetchDeliveredOrders({ pageSize: 5, sortBy: 'createdAtUtc', sortDirection: 'desc' }));
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <PageHeader title="Driver dashboard" subtitle="See work that needs attention first." />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
        <MetricCard title="Available" value={available.totalCount} icon={<AssignmentIcon />} to="/orders/available" />
        <MetricCard title="Active" value={active.totalCount} icon={<LocalShippingIcon />} to="/orders/active" />
        <MetricCard title="Delivered" value={delivered.totalCount} icon={<CheckCircleIcon />} to="/orders/delivered" />
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>My active orders</Typography>
            <Button component={RouterLink} to="/orders/active">View all</Button>
          </Stack>
          {active.loading && <LoadingState label="Loading active orders..." />}
          {active.error && <ErrorState message={active.error} onRetry={() => dispatch(fetchActiveOrders({ pageSize: 5 }))} />}
          {!active.loading && !active.error && active.items.length === 0 && <EmptyState title="No active orders" description="Accepted or picked-up orders will appear here." />}
          <Stack spacing={2}>{active.items.map((order) => <OrderCard key={order.id} order={order} />)}</Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
