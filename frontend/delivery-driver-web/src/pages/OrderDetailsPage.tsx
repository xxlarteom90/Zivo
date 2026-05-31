import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedOrder } from '../features/orders/ordersSlice';
import { acceptOrder, fetchOrderDetails, markOrderDelivered, markOrderPickedUp } from '../features/orders/orderThunks';
import {
  selectOrderActionError,
  selectOrderActionLoading,
  selectSelectedOrder,
  selectSelectedOrderError,
  selectSelectedOrderLoading
} from '../features/orders/orderSelectors';
import { MapButtons } from '../features/orders/components/MapButtons';
import { OrderActionButtons } from '../features/orders/components/OrderActionButtons';
import { OrderItemsList } from '../features/orders/components/OrderItemsList';
import { OrderStatusChip } from '../features/orders/components/OrderStatusChip';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PageHeader } from '../shared/components/PageHeader';
import { formatDateTime, formatTimeWindow } from '../shared/utils/dateFormat';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectSelectedOrder);
  const loading = useAppSelector(selectSelectedOrderLoading);
  const error = useAppSelector(selectSelectedOrderError);
  const actionLoading = useAppSelector(selectOrderActionLoading);
  const actionError = useAppSelector(selectOrderActionError);

  useEffect(() => {
    if (id) dispatch(fetchOrderDetails(id));
    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

  const reload = () => id && dispatch(fetchOrderDetails(id));

  if (!id) return <ErrorState message="Order id is missing." />;
  if (loading) return <LoadingState label="Loading order details..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!order) return null;

  const handleAccept = async () => {
    const result = await dispatch(acceptOrder(order.id));
    if (acceptOrder.fulfilled.match(result)) reload();
  };
  const handlePickedUp = async () => {
    const result = await dispatch(markOrderPickedUp(order.id));
    if (markOrderPickedUp.fulfilled.match(result)) reload();
  };
  const handleDelivered = async () => {
    const result = await dispatch(markOrderDelivered(order.id));
    if (markOrderDelivered.fulfilled.match(result)) reload();
  };

  return (
    <Stack spacing={2.5}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start' }}>
        Back
      </Button>
      <PageHeader
        title={order.publicOrderNumber}
        subtitle={`${order.customer.fullName} - ${order.partnerBusiness.name}`}
        action={<OrderStatusChip status={order.status} />}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: 2 }}>
        <Stack spacing={2}>
          <SectionCard title="Pickup">
            <Typography sx={{ fontWeight: 700 }}>{order.pickupAddress.summary}</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{formatTimeWindow(order.pickupWindowStartUtc, order.pickupWindowEndUtc)}</Typography>
            <MapButtons address={order.pickupAddress} />
          </SectionCard>

          <SectionCard title="Delivery">
            <Typography sx={{ fontWeight: 700 }}>{order.deliveryAddress.summary}</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{formatTimeWindow(order.deliveryWindowStartUtc, order.deliveryWindowEndUtc)}</Typography>
            <MapButtons address={order.deliveryAddress} />
          </SectionCard>

          <SectionCard title="Items to handle">
            <OrderItemsList items={order.items} />
          </SectionCard>
        </Stack>

        <Stack spacing={2}>
          <SectionCard title="Customer">
            <Typography sx={{ fontWeight: 700 }}>{order.customer.fullName}</Typography>
            <Typography color="text.secondary">{order.customer.phoneNumber}</Typography>
            {order.customer.email && <Typography color="text.secondary">{order.customer.email}</Typography>}
          </SectionCard>

          <SectionCard title="Partner business">
            <Typography sx={{ fontWeight: 700 }}>{order.partnerBusiness.name}</Typography>
            <Typography color="text.secondary">{order.partnerBusiness.businessType}</Typography>
            <Typography color="text.secondary">{order.partnerBusiness.phoneNumber}</Typography>
          </SectionCard>

          {(order.notes || order.specialInstructions) && (
            <SectionCard title="Notes and instructions">
              {order.specialInstructions && <Alert severity="warning" sx={{ mb: 1.5 }}>{order.specialInstructions}</Alert>}
              {order.notes && <Typography>{order.notes}</Typography>}
            </SectionCard>
          )}

          <SectionCard title="Status history">
            <Stack spacing={1.5} divider={<Divider flexItem />}>
              {order.statusHistory.map((history) => (
                <Box key={history.id}>
                  <Typography sx={{ fontWeight: 700 }}>{history.fromStatus ? `${history.fromStatus} -> ${history.toStatus}` : history.toStatus}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {history.reason} by {history.changedBy} at {formatDateTime(history.changedAtUtc)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Stack>
      </Box>

      <Card sx={{ position: { xs: 'sticky', md: 'static' }, bottom: { xs: 72, md: 'auto' }, zIndex: 5, borderRadius: 3 }} elevation={4}>
        <CardContent>
          <OrderActionButtons
            actions={order.availableActions}
            loading={actionLoading}
            error={actionError}
            onAccept={handleAccept}
            onMarkPickedUp={handlePickedUp}
            onMarkDelivered={handleDelivered}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
