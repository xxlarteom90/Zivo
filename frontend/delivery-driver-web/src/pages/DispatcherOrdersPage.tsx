import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { selectIsDispatcher } from '../features/auth/authSelectors';
import {
  cancelDispatcherOrder,
  clearError,
  createDispatcherOrder,
  fetchDispatcherLookups,
  fetchDispatcherOrders,
  selectDispatcherCustomers,
  selectDispatcherOrders,
  selectDispatcherOrdersError,
  selectDispatcherOrdersLoading,
  selectDispatcherPartners,
  selectDispatcherSaving,
  updateDispatcherOrder
} from '../features/dispatcher/dispatcherOrdersSlice';
import { useTranslation } from '../features/i18n/useTranslation';
import { dispatcherOrdersApi, type DispatcherAddressInput, type DispatcherOrderItemInput } from '../services/dispatcherOrdersApi';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { OrderListItemDto, OrderStatus } from '../entities/order';

const STATUS_COLORS: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  Available: 'info',
  Accepted: 'warning',
  PickedUp: 'warning',
  Delivered: 'success',
  Cancelled: 'error'
};

const ITEM_TYPES = ['Carpet', 'Pillow', 'Clothing', 'Curtain', 'Upholstery', 'Other'];

const EMPTY_ADDRESS: DispatcherAddressInput = {
  line1: '',
  city: '',
  country: 'Romania'
};

interface FormState {
  partnerBusinessId: string;
  customerId: string;
  pickupAddress: DispatcherAddressInput;
  deliveryAddress: DispatcherAddressInput;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  notes: string;
  specialInstructions: string;
  items: DispatcherOrderItemInput[];
}

function emptyForm(): FormState {
  return {
    partnerBusinessId: '',
    customerId: '',
    pickupAddress: { ...EMPTY_ADDRESS },
    deliveryAddress: { ...EMPTY_ADDRESS },
    pickupWindowStart: '',
    pickupWindowEnd: '',
    deliveryWindowStart: '',
    deliveryWindowEnd: '',
    notes: '',
    specialInstructions: '',
    items: [{ itemType: 'Carpet', description: '', quantity: 1, estimatedWeightKg: null, notes: '' }]
  };
}

function toUtcOrNull(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function toLocalInput(utc?: string | null): string {
  if (!utc) return '';
  const d = new Date(utc);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DispatcherOrdersPage() {
  const dispatch = useAppDispatch();
  const isDispatcher = useAppSelector(selectIsDispatcher);
  const orders = useAppSelector(selectDispatcherOrders);
  const loading = useAppSelector(selectDispatcherOrdersLoading);
  const saving = useAppSelector(selectDispatcherSaving);
  const error = useAppSelector(selectDispatcherOrdersError);
  const partners = useAppSelector(selectDispatcherPartners);
  const customers = useAppSelector(selectDispatcherCustomers);
  const { t } = useTranslation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cancelTarget, setCancelTarget] = useState<OrderListItemDto | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (isDispatcher) {
      dispatch(fetchDispatcherOrders());
      dispatch(fetchDispatcherLookups());
    }
  }, [dispatch, isDispatcher]);

  const partnerById = useMemo(() => new Map(partners.map((p) => [p.id, p])), [partners]);
  const customerById = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);

  if (!isDispatcher) return <Navigate to="/" replace />;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEdit = async (orderId: string) => {
    try {
      const details = await dispatcherOrdersApi.getById(orderId);
      setEditingId(orderId);
      setForm({
        partnerBusinessId: details.partnerBusiness.id,
        customerId: details.customer.id,
        pickupAddress: {
          line1: details.pickupAddress.line1,
          line2: details.pickupAddress.line2 ?? '',
          city: details.pickupAddress.city,
          countyOrRegion: details.pickupAddress.countyOrRegion ?? '',
          postalCode: details.pickupAddress.postalCode ?? '',
          country: details.pickupAddress.country,
          latitude: details.pickupAddress.latitude ?? null,
          longitude: details.pickupAddress.longitude ?? null
        },
        deliveryAddress: {
          line1: details.deliveryAddress.line1,
          line2: details.deliveryAddress.line2 ?? '',
          city: details.deliveryAddress.city,
          countyOrRegion: details.deliveryAddress.countyOrRegion ?? '',
          postalCode: details.deliveryAddress.postalCode ?? '',
          country: details.deliveryAddress.country,
          latitude: details.deliveryAddress.latitude ?? null,
          longitude: details.deliveryAddress.longitude ?? null
        },
        pickupWindowStart: toLocalInput(details.pickupWindowStartUtc),
        pickupWindowEnd: toLocalInput(details.pickupWindowEndUtc),
        deliveryWindowStart: toLocalInput(details.deliveryWindowStartUtc),
        deliveryWindowEnd: toLocalInput(details.deliveryWindowEndUtc),
        notes: details.notes ?? '',
        specialInstructions: details.specialInstructions ?? '',
        items: details.items.map((i) => ({
          itemType: i.itemType,
          description: i.description,
          quantity: i.quantity,
          estimatedWeightKg: i.estimatedWeightKg ?? null,
          notes: i.notes ?? ''
        }))
      });
      setFormOpen(true);
    } catch {
      /* error captured by axios */
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    dispatch(clearError());
  };

  const submitForm = async () => {
    const basePayload = {
      partnerBusinessId: form.partnerBusinessId,
      customerId: form.customerId,
      pickupAddress: form.pickupAddress,
      deliveryAddress: form.deliveryAddress,
      pickupWindowStartUtc: toUtcOrNull(form.pickupWindowStart),
      pickupWindowEndUtc: toUtcOrNull(form.pickupWindowEnd),
      deliveryWindowStartUtc: toUtcOrNull(form.deliveryWindowStart),
      deliveryWindowEndUtc: toUtcOrNull(form.deliveryWindowEnd),
      notes: form.notes || null,
      specialInstructions: form.specialInstructions || null
    };

    let result;
    if (editingId) {
      result = await dispatch(updateDispatcherOrder({ id: editingId, request: basePayload }));
    } else {
      result = await dispatch(createDispatcherOrder({ ...basePayload, items: form.items }));
    }
    if (result.meta.requestStatus === 'fulfilled') {
      closeForm();
      dispatch(fetchDispatcherOrders());
    }
  };

  const submitCancel = async () => {
    if (!cancelTarget) return;
    const result = await dispatch(cancelDispatcherOrder({
      id: cancelTarget.id,
      request: { reason: cancelReason || 'Cancelled by dispatcher' }
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      setCancelTarget(null);
      setCancelReason('');
      dispatch(fetchDispatcherOrders());
    }
  };

  const updateItem = (idx: number, patch: Partial<DispatcherOrderItemInput>) => {
    setForm((f) => ({ ...f, items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) }));
  };

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { itemType: 'Carpet', description: '', quantity: 1, estimatedWeightKg: null, notes: '' }] }));
  const removeItem = (idx: number) => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const formValid =
    form.partnerBusinessId &&
    form.customerId &&
    form.pickupAddress.line1 && form.pickupAddress.city && form.pickupAddress.country &&
    form.deliveryAddress.line1 && form.deliveryAddress.city && form.deliveryAddress.country &&
    (editingId !== null || (form.items.length > 0 && form.items.every((it) => it.description && it.quantity > 0)));

  return (
    <Stack spacing={3}>
      <PageHeader title={t('manage.title')} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography color="text.secondary">{t('manage.subtitle')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('manage.create')}
        </Button>
      </Stack>

      {error && <Alert severity="error" onClose={() => dispatch(clearError())}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('manage.col.number')}</TableCell>
                <TableCell>{t('manage.col.status')}</TableCell>
                <TableCell>{t('manage.col.partner')}</TableCell>
                <TableCell>{t('manage.col.customer')}</TableCell>
                <TableCell>{t('manage.col.delivery')}</TableCell>
                <TableCell align="right">{t('manage.col.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center"><Typography color="text.secondary">{t('manage.empty')}</Typography></TableCell></TableRow>
              )}
              {orders.map((o) => {
                const editable = o.status !== 'Delivered' && o.status !== 'Cancelled';
                const cancellable = editable;
                return (
                  <TableRow key={o.id} hover>
                    <TableCell>{o.publicOrderNumber}</TableCell>
                    <TableCell><Chip label={o.status} color={STATUS_COLORS[o.status]} size="small" /></TableCell>
                    <TableCell>{o.partnerBusinessName}</TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell>{o.deliveryAddressSummary}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" disabled={!editable} onClick={() => openEdit(o.id)} title={t('manage.edit')}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" disabled={!cancellable} onClick={() => setCancelTarget(o)} title={t('manage.cancelOrder')}><CancelIcon fontSize="small" color={cancellable ? 'error' : 'disabled'} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={formOpen} onClose={closeForm} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? t('manage.edit') : t('manage.create')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Autocomplete
              options={partners}
              getOptionLabel={(p) => p.name}
              value={partnerById.get(form.partnerBusinessId) ?? null}
              onChange={(_, v) => setForm((f) => ({ ...f, partnerBusinessId: v?.id ?? '' }))}
              renderInput={(params) => <TextField {...params} label={t('manage.field.partner')} required />}
            />
            <Autocomplete
              options={customers}
              getOptionLabel={(c) => c.fullName}
              value={customerById.get(form.customerId) ?? null}
              onChange={(_, v) => setForm((f) => ({ ...f, customerId: v?.id ?? '' }))}
              renderInput={(params) => <TextField {...params} label={t('manage.field.customer')} required />}
            />

            <Typography variant="overline">{t('manage.field.pickupAddress')}</Typography>
            <AddressFields value={form.pickupAddress} onChange={(v) => setForm((f) => ({ ...f, pickupAddress: v }))} t={t} />

            <Typography variant="overline">{t('manage.field.deliveryAddress')}</Typography>
            <AddressFields value={form.deliveryAddress} onChange={(v) => setForm((f) => ({ ...f, deliveryAddress: v }))} t={t} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField type="datetime-local" label={t('manage.field.pickupStart')} InputLabelProps={{ shrink: true }} value={form.pickupWindowStart} onChange={(e) => setForm((f) => ({ ...f, pickupWindowStart: e.target.value }))} fullWidth />
              <TextField type="datetime-local" label={t('manage.field.pickupEnd')} InputLabelProps={{ shrink: true }} value={form.pickupWindowEnd} onChange={(e) => setForm((f) => ({ ...f, pickupWindowEnd: e.target.value }))} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField type="datetime-local" label={t('manage.field.deliveryStart')} InputLabelProps={{ shrink: true }} value={form.deliveryWindowStart} onChange={(e) => setForm((f) => ({ ...f, deliveryWindowStart: e.target.value }))} fullWidth />
              <TextField type="datetime-local" label={t('manage.field.deliveryEnd')} InputLabelProps={{ shrink: true }} value={form.deliveryWindowEnd} onChange={(e) => setForm((f) => ({ ...f, deliveryWindowEnd: e.target.value }))} fullWidth />
            </Stack>

            <TextField label={t('manage.field.notes')} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} multiline minRows={2} />
            <TextField label={t('manage.field.specialInstructions')} value={form.specialInstructions} onChange={(e) => setForm((f) => ({ ...f, specialInstructions: e.target.value }))} multiline minRows={2} />

            {!editingId && (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="overline">{t('manage.field.items')}</Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addItem}>{t('manage.addItem')}</Button>
                </Stack>
                {form.items.map((it, idx) => (
                  <Stack key={idx} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <TextField select label={t('manage.field.item.type')} value={it.itemType} onChange={(e) => updateItem(idx, { itemType: e.target.value })} sx={{ minWidth: 140 }}>
                      {ITEM_TYPES.map((tp) => <MenuItem key={tp} value={tp}>{tp}</MenuItem>)}
                    </TextField>
                    <TextField label={t('manage.field.item.description')} value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} fullWidth required />
                    <TextField type="number" label={t('manage.field.item.quantity')} value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })} sx={{ width: 100 }} required />
                    <TextField type="number" label={t('manage.field.item.weight')} value={it.estimatedWeightKg ?? ''} onChange={(e) => updateItem(idx, { estimatedWeightKg: e.target.value === '' ? null : Number(e.target.value) })} sx={{ width: 120 }} />
                    <IconButton onClick={() => removeItem(idx)} disabled={form.items.length === 1}><DeleteIcon /></IconButton>
                  </Stack>
                ))}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>{t('common.cancel')}</Button>
          <Button onClick={submitForm} variant="contained" disabled={!formValid || saving}>
            {saving ? <CircularProgress size={20} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelTarget !== null} onClose={() => setCancelTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle>{t('manage.cancelOrder')}</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>{t('manage.confirmCancel', { number: cancelTarget?.publicOrderNumber ?? '' })}</Typography>
          <TextField label={t('manage.cancelReason')} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} fullWidth multiline minRows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)}>{t('common.cancel')}</Button>
          <Button onClick={submitCancel} variant="contained" color="error" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : t('manage.cancelOrder')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

interface AddressFieldsProps {
  value: DispatcherAddressInput;
  onChange: (v: DispatcherAddressInput) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

function AddressFields({ value, onChange, t }: AddressFieldsProps) {
  const patch = (p: Partial<DispatcherAddressInput>) => onChange({ ...value, ...p });
  return (
    <Stack spacing={1.5}>
      <TextField label={t('manage.field.street')} value={value.line1} onChange={(e) => patch({ line1: e.target.value })} required />
      <TextField label={t('manage.field.street') + ' 2'} value={value.line2 ?? ''} onChange={(e) => patch({ line2: e.target.value })} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField label={t('manage.field.city')} value={value.city} onChange={(e) => patch({ city: e.target.value })} required fullWidth />
        <TextField label={t('manage.field.postalCode')} value={value.postalCode ?? ''} onChange={(e) => patch({ postalCode: e.target.value })} sx={{ width: { sm: 140 } }} />
      </Stack>
      <TextField label={t('manage.field.country')} value={value.country} onChange={(e) => patch({ country: e.target.value })} required />
    </Stack>
  );
}
