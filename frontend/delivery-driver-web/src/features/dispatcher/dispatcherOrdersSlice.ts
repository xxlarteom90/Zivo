import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  dispatcherOrdersApi,
  type CancelDispatcherOrderRequest,
  type CreateDispatcherOrderRequest,
  type CustomerOption,
  type PartnerBusinessOption,
  type UpdateDispatcherOrderRequest
} from '../../services/dispatcherOrdersApi';
import { normalizeApiError } from '../../services/apiClient';
import type { OrderDetailsDto, OrderListItemDto } from '../../entities/order';
import type { RootState } from '../../store/rootReducer';

interface DispatcherOrdersState {
  items: OrderListItemDto[];
  loading: boolean;
  error: string | null;
  partners: PartnerBusinessOption[];
  customers: CustomerOption[];
  partnersLoaded: boolean;
  customersLoaded: boolean;
  saving: boolean;
}

const initialState: DispatcherOrdersState = {
  items: [],
  loading: false,
  error: null,
  partners: [],
  customers: [],
  partnersLoaded: false,
  customersLoaded: false,
  saving: false
};

export const fetchDispatcherOrders = createAsyncThunk<OrderListItemDto[], void, { rejectValue: string }>(
  'dispatcherOrders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await dispatcherOrdersApi.list({ pageSize: 100, sortBy: 'createdAtUtc', sortDirection: 'desc' });
      return res.items;
    } catch (err) {
      return rejectWithValue(normalizeApiError(err).message);
    }
  }
);

export const fetchDispatcherLookups = createAsyncThunk<{ partners: PartnerBusinessOption[]; customers: CustomerOption[] }, void, { rejectValue: string }>(
  'dispatcherOrders/fetchLookups',
  async (_, { rejectWithValue }) => {
    try {
      const [partners, customers] = await Promise.all([
        dispatcherOrdersApi.listPartners(),
        dispatcherOrdersApi.listCustomers()
      ]);
      return { partners, customers };
    } catch (err) {
      return rejectWithValue(normalizeApiError(err).message);
    }
  }
);

export const createDispatcherOrder = createAsyncThunk<OrderDetailsDto, CreateDispatcherOrderRequest, { rejectValue: string }>(
  'dispatcherOrders/create',
  async (req, { rejectWithValue }) => {
    try {
      return await dispatcherOrdersApi.create(req);
    } catch (err) {
      return rejectWithValue(normalizeApiError(err).message);
    }
  }
);

export const updateDispatcherOrder = createAsyncThunk<OrderDetailsDto, { id: string; request: UpdateDispatcherOrderRequest }, { rejectValue: string }>(
  'dispatcherOrders/update',
  async ({ id, request }, { rejectWithValue }) => {
    try {
      return await dispatcherOrdersApi.update(id, request);
    } catch (err) {
      return rejectWithValue(normalizeApiError(err).message);
    }
  }
);

export const cancelDispatcherOrder = createAsyncThunk<OrderDetailsDto, { id: string; request: CancelDispatcherOrderRequest }, { rejectValue: string }>(
  'dispatcherOrders/cancel',
  async ({ id, request }, { rejectWithValue }) => {
    try {
      return await dispatcherOrdersApi.cancel(id, request);
    } catch (err) {
      return rejectWithValue(normalizeApiError(err).message);
    }
  }
);

const slice = createSlice({
  name: 'dispatcherOrders',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispatcherOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDispatcherOrders.fulfilled, (state, action: PayloadAction<OrderListItemDto[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDispatcherOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load orders';
      })
      .addCase(fetchDispatcherLookups.fulfilled, (state, action) => {
        state.partners = action.payload.partners;
        state.customers = action.payload.customers;
        state.partnersLoaded = true;
        state.customersLoaded = true;
      })
      .addCase(createDispatcherOrder.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(createDispatcherOrder.fulfilled, (state) => { state.saving = false; })
      .addCase(createDispatcherOrder.rejected, (state, action) => { state.saving = false; state.error = action.payload ?? 'Failed to create order'; })
      .addCase(updateDispatcherOrder.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(updateDispatcherOrder.fulfilled, (state) => { state.saving = false; })
      .addCase(updateDispatcherOrder.rejected, (state, action) => { state.saving = false; state.error = action.payload ?? 'Failed to update order'; })
      .addCase(cancelDispatcherOrder.pending, (state) => { state.saving = true; })
      .addCase(cancelDispatcherOrder.fulfilled, (state) => { state.saving = false; })
      .addCase(cancelDispatcherOrder.rejected, (state, action) => { state.saving = false; state.error = action.payload ?? 'Failed to cancel order'; });
  }
});

export const { clearError } = slice.actions;
export const dispatcherOrdersReducer = slice.reducer;

export const selectDispatcherOrders = (state: RootState) => state.dispatcherOrders.items;
export const selectDispatcherOrdersLoading = (state: RootState) => state.dispatcherOrders.loading;
export const selectDispatcherOrdersError = (state: RootState) => state.dispatcherOrders.error;
export const selectDispatcherPartners = (state: RootState) => state.dispatcherOrders.partners;
export const selectDispatcherCustomers = (state: RootState) => state.dispatcherOrders.customers;
export const selectDispatcherSaving = (state: RootState) => state.dispatcherOrders.saving;
