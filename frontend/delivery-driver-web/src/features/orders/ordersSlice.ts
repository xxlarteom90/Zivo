import { createSlice } from '@reduxjs/toolkit';
import type { PagedResponse } from '../../entities/api';
import type { OrderDetailsDto, OrderListItemDto } from '../../entities/order';
import {
  acceptOrder,
  fetchActiveOrders,
  fetchAvailableOrders,
  fetchDeliveredOrders,
  fetchOrderDetails,
  markOrderDelivered,
  markOrderPickedUp
} from './orderThunks';

interface OrderListState {
  items: OrderListItemDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

interface OrdersState {
  available: OrderListState;
  active: OrderListState;
  delivered: OrderListState;
  selectedOrder: OrderDetailsDto | null;
  selectedLoading: boolean;
  selectedError: string | null;
  actionLoading: boolean;
  actionError: string | null;
}

const emptyList = (): OrderListState => ({
  items: [],
  pageNumber: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  loading: false,
  error: null
});

const initialState: OrdersState = {
  available: emptyList(),
  active: emptyList(),
  delivered: emptyList(),
  selectedOrder: null,
  selectedLoading: false,
  selectedError: null,
  actionLoading: false,
  actionError: null
};

function applyPagedResponse(state: OrderListState, payload: PagedResponse<OrderListItemDto>) {
  state.items = payload.items;
  state.pageNumber = payload.pageNumber;
  state.pageSize = payload.pageSize;
  state.totalCount = payload.totalCount;
  state.totalPages = payload.totalPages;
}

function readError(payload: unknown) {
  return typeof payload === 'string' ? payload : 'Unable to complete the request.';
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.selectedError = null;
    },
    clearActionError: (state) => {
      state.actionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableOrders.pending, (state) => {
        state.available.loading = true;
        state.available.error = null;
      })
      .addCase(fetchAvailableOrders.fulfilled, (state, action) => {
        state.available.loading = false;
        applyPagedResponse(state.available, action.payload);
      })
      .addCase(fetchAvailableOrders.rejected, (state, action) => {
        state.available.loading = false;
        state.available.error = readError(action.payload);
      })
      .addCase(fetchActiveOrders.pending, (state) => {
        state.active.loading = true;
        state.active.error = null;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.active.loading = false;
        applyPagedResponse(state.active, action.payload);
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.active.loading = false;
        state.active.error = readError(action.payload);
      })
      .addCase(fetchDeliveredOrders.pending, (state) => {
        state.delivered.loading = true;
        state.delivered.error = null;
      })
      .addCase(fetchDeliveredOrders.fulfilled, (state, action) => {
        state.delivered.loading = false;
        applyPagedResponse(state.delivered, action.payload);
      })
      .addCase(fetchDeliveredOrders.rejected, (state, action) => {
        state.delivered.loading = false;
        state.delivered.error = readError(action.payload);
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = readError(action.payload);
      })
      .addCase(acceptOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = readError(action.payload);
      })
      .addCase(markOrderPickedUp.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(markOrderPickedUp.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(markOrderPickedUp.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = readError(action.payload);
      })
      .addCase(markOrderDelivered.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(markOrderDelivered.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = readError(action.payload);
      });
  }
});

export const { clearSelectedOrder, clearActionError } = ordersSlice.actions;
export default ordersSlice.reducer;
