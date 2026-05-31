import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchActiveOrders } from '../features/orders/orderThunks';
import { selectActiveOrders } from '../features/orders/orderSelectors';
import { OrderCard } from '../features/orders/components/OrderCard';
import { OrderFilters } from '../features/orders/components/OrderFilters';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PageHeader } from '../shared/components/PageHeader';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function MyActiveOrdersPage() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectActiveOrders);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const load = () => dispatch(fetchActiveOrders({ search: debouncedSearch, pageSize: 20 }));

  useEffect(() => {
    load();
  }, [debouncedSearch]);

  return (
    <Stack spacing={2}>
      <PageHeader title="My active orders" subtitle="Continue accepted and picked-up jobs." />
      <OrderFilters search={search} onSearchChange={setSearch} />
      {active.loading && <LoadingState label="Loading active orders..." />}
      {active.error && <ErrorState message={active.error} onRetry={load} />}
      {!active.loading && !active.error && active.items.length === 0 && <EmptyState title="No active orders" description="Accept an available order to start working." />}
      <Stack spacing={2}>{active.items.map((order) => <OrderCard key={order.id} order={order} />)}</Stack>
    </Stack>
  );
}
