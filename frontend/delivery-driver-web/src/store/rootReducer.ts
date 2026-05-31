import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
