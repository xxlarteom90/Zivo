import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { dispatcherOrdersReducer } from '../features/dispatcher/dispatcherOrdersSlice';
import i18nReducer from '../features/i18n/i18nSlice';
import ordersReducer from '../features/orders/ordersSlice';
import performanceReducer from '../features/performance/performanceSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
  performance: performanceReducer,
  i18n: i18nReducer,
  dispatcherOrders: dispatcherOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
