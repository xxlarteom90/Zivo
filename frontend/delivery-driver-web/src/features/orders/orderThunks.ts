import { createAsyncThunk } from '@reduxjs/toolkit';
import type { OrderQueryParameters } from '../../entities/order';
import { normalizeApiError } from '../../services/apiClient';
import { ordersApi } from '../../services/ordersApi';

export const fetchAvailableOrders = createAsyncThunk(
  'orders/fetchAvailable',
  async (query: OrderQueryParameters | undefined, { rejectWithValue }) => {
    try {
      return await ordersApi.getAvailable(query);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const fetchActiveOrders = createAsyncThunk(
  'orders/fetchActive',
  async (query: OrderQueryParameters | undefined, { rejectWithValue }) => {
    try {
      return await ordersApi.getActive(query);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const fetchDeliveredOrders = createAsyncThunk(
  'orders/fetchDelivered',
  async (query: OrderQueryParameters | undefined, { rejectWithValue }) => {
    try {
      return await ordersApi.getDelivered(query);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ordersApi.getDetails(id);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/accept',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ordersApi.accept(id);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const markOrderPickedUp = createAsyncThunk(
  'orders/markPickedUp',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ordersApi.markPickedUp(id);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const markOrderDelivered = createAsyncThunk(
  'orders/markDelivered',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ordersApi.markDelivered(id);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);
