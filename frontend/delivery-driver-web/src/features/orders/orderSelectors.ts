import type { RootState } from '../../store/rootReducer';

export const selectAvailableOrders = (state: RootState) => state.orders.available;
export const selectActiveOrders = (state: RootState) => state.orders.active;
export const selectDeliveredOrders = (state: RootState) => state.orders.delivered;
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;
export const selectSelectedOrderLoading = (state: RootState) => state.orders.selectedLoading;
export const selectSelectedOrderError = (state: RootState) => state.orders.selectedError;
export const selectOrderActionLoading = (state: RootState) => state.orders.actionLoading;
export const selectOrderActionError = (state: RootState) => state.orders.actionError;
