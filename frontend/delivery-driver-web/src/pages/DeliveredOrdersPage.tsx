import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from '../features/i18n/useTranslation';
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
  const { t } = useTranslation();
  const load = () => dispatch(fetchDeliveredOrders({ search: debouncedSearch, pageSize: 20, sortBy: 'createdAtUtc', sortDirection: 'desc' }));

  useEffect(() => {
    load();
  }, [debouncedSearch]);

  return (
    <Stack spacing={2}>
      <PageHeader title={t('order.list.delivered.title')} subtitle={t('order.list.delivered.subtitle')} />
      <OrderFilters search={search} onSearchChange={setSearch} placeholder={t('order.searchDelivered')} />
      {delivered.loading && <LoadingState label={t('order.list.delivered.loading')} />}
      {delivered.error && <ErrorState message={delivered.error} onRetry={load} />}
      {!delivered.loading && !delivered.error && delivered.items.length === 0 && <EmptyState title={t('order.list.delivered.emptyTitle')} description={t('order.list.delivered.emptyDesc')} />}
      <Stack spacing={2}>{delivered.items.map((order) => <OrderCard key={order.id} order={order} />)}</Stack>
    </Stack>
  );
}
