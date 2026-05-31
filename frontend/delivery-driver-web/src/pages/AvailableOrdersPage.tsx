import { Alert, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { acceptOrder, fetchAvailableOrders } from '../features/orders/orderThunks';
import { selectAvailableOrders, selectOrderActionError, selectOrderActionLoading } from '../features/orders/orderSelectors';
import { OrderCard } from '../features/orders/components/OrderCard';
import { OrderFilters } from '../features/orders/components/OrderFilters';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PageHeader } from '../shared/components/PageHeader';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function AvailableOrdersPage() {
  const dispatch = useAppDispatch();
  const available = useAppSelector(selectAvailableOrders);
  const actionLoading = useAppSelector(selectOrderActionLoading);
  const actionError = useAppSelector(selectOrderActionError);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const load = () => dispatch(fetchAvailableOrders({ search: debouncedSearch, pageSize: 20, sortBy: 'pickupWindowStartUtc', sortDirection: 'asc' }));

  useEffect(() => {
    load();
  }, [debouncedSearch]);

  const handleAccept = async (id: string) => {
    const result = await dispatch(acceptOrder(id));
    if (acceptOrder.fulfilled.match(result)) {
      load();
    }
  };

  return (
    <Stack spacing={2}>
      <PageHeader title="Available orders" subtitle="Accept jobs that are ready for pickup." />
      <OrderFilters search={search} onSearchChange={setSearch} />
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {available.loading && <LoadingState label="Loading available orders..." />}
      {available.error && <ErrorState message={available.error} onRetry={load} />}
      {!available.loading && !available.error && available.items.length === 0 && <EmptyState title="No available orders" description="New dispatcher-created orders will appear here." />}
      <Stack spacing={2}>
        {available.items.map((order) => (
          <OrderCard key={order.id} order={order} primaryActionLabel="Accept order" primaryActionLoading={actionLoading} onPrimaryAction={handleAccept} />
        ))}
      </Stack>
    </Stack>
  );
}
