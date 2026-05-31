import { apiClient } from './apiClient';
import type { ApiResponse, PagedResponse } from '../entities/api';
import type { OrderDetailsDto, OrderListItemDto, OrderQueryParameters } from '../entities/order';

function toQueryString(query?: OrderQueryParameters): URLSearchParams {
  const params = new URLSearchParams();
  if (!query) return params;

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  return params;
}

async function getPaged(path: string, query?: OrderQueryParameters): Promise<PagedResponse<OrderListItemDto>> {
  const params = toQueryString(query);
  const response = await apiClient.get<ApiResponse<PagedResponse<OrderListItemDto>>>(path, { params });
  return response.data.data;
}

export const ordersApi = {
  getAvailable: (query?: OrderQueryParameters) => getPaged('/driver/orders/available', query),
  getActive: (query?: OrderQueryParameters) => getPaged('/driver/orders/active', query),
  getDelivered: (query?: OrderQueryParameters) => getPaged('/driver/orders/delivered', query),
  getDetails: async (id: string): Promise<OrderDetailsDto> => {
    const response = await apiClient.get<ApiResponse<OrderDetailsDto>>(`/driver/orders/${id}`);
    return response.data.data;
  },
  accept: async (id: string): Promise<OrderDetailsDto> => {
    const response = await apiClient.post<ApiResponse<OrderDetailsDto>>(`/driver/orders/${id}/accept`);
    return response.data.data;
  },
  markPickedUp: async (id: string): Promise<OrderDetailsDto> => {
    const response = await apiClient.post<ApiResponse<OrderDetailsDto>>(`/driver/orders/${id}/mark-picked-up`);
    return response.data.data;
  },
  markDelivered: async (id: string): Promise<OrderDetailsDto> => {
    const response = await apiClient.post<ApiResponse<OrderDetailsDto>>(`/driver/orders/${id}/mark-delivered`);
    return response.data.data;
  }
};
