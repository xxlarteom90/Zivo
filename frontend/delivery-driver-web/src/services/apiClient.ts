import axios from 'axios';
import type { ApiErrorPayload, ApiErrorViewModel } from '../entities/api';

export const TOKEN_STORAGE_KEY = 'delivery_app_access_token';
export const USER_STORAGE_KEY = 'delivery_app_user';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function normalizeApiError(error: unknown): ApiErrorViewModel {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (payload?.error) {
      return {
        code: payload.error.code,
        message: payload.error.message,
        details: payload.error.details,
        traceId: payload.traceId,
        status
      };
    }

    if (error.code === 'ECONNABORTED' || status === 503) {
      return {
        code: 'TRANSIENT_ERROR',
        message: 'The server is temporarily unavailable. Please try again.',
        status
      };
    }

    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Cannot reach the API. Check that the backend is running.',
        status
      };
    }
  }

  return {
    code: 'UNEXPECTED_ERROR',
    message: 'Something went wrong. Please try again.'
  };
}
