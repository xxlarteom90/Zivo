import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchDeliveredOrders } from '../features/orders/orderThunks';
import { selectDeliveredOrders } from '../features/orders/orderSelectors';
import { OrderCard } from '../features/orders/components/OrderCard';
import { OrderFilters } from '../features/orders/components/OrderFilters';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PageHeader } from '../shared/components/PageHeader';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function DeliveredOrdersPage() {
  const dispatch = useAppDispatch();
  const delivered = useAppSelector(selectDeliveredOrders);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const load = () => dispatch(fetchDeliveredOrders({ search: debouncedSearch, pageSize: 20, sortBy: 'createdAtUtc', sortDirection: 'desc' }));

  useEffect(() => {
    load();
  }, [debouncedSearch]);

  return (
    <Stack spacing={2}>
      <PageHeader title="Delivered orders" subtitle="Review completed delivery history." />
      <OrderFilters search={search} onSearchChange={setSearch} placeholder="Search delivered orders..." />
      {delivered.loading && <LoadingState label="Loading delivered orders..." />}
      {delivered.error && <ErrorState message={delivered.error} onRetry={load} />}
      {!delivered.loading && !delivered.error && delivered.items.length === 0 && <EmptyState title="No delivered orders" description="Completed orders will appear here." />}
      <Stack spacing={2}>{delivered.items.map((order) => <OrderCard key={order.id} order={order} />)}</Stack>
    </Stack>
  );
}
