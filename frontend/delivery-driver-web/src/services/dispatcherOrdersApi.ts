import { apiClient } from './apiClient';
import type { ApiResponse, PagedResponse } from '../entities/api';
import type { OrderDetailsDto, OrderListItemDto, OrderQueryParameters } from '../entities/order';

export interface DispatcherAddressInput {
  line1: string;
  line2?: string | null;
  city: string;
  countyOrRegion?: string | null;
  postalCode?: string | null;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DispatcherOrderItemInput {
  itemType: string;
  description: string;
  quantity: number;
  estimatedWeightKg?: number | null;
  notes?: string | null;
}

export interface CreateDispatcherOrderRequest {
  partnerBusinessId: string;
  customerId: string;
  pickupAddress: DispatcherAddressInput;
  deliveryAddress: DispatcherAddressInput;
  pickupWindowStartUtc?: string | null;
  pickupWindowEndUtc?: string | null;
  deliveryWindowStartUtc?: string | null;
  deliveryWindowEndUtc?: string | null;
  notes?: string | null;
  specialInstructions?: string | null;
  items: DispatcherOrderItemInput[];
}

export interface UpdateDispatcherOrderRequest {
  partnerBusinessId?: string;
  customerId?: string;
  pickupAddress?: DispatcherAddressInput;
  deliveryAddress?: DispatcherAddressInput;
  pickupWindowStartUtc?: string | null;
  pickupWindowEndUtc?: string | null;
  deliveryWindowStartUtc?: string | null;
  deliveryWindowEndUtc?: string | null;
  notes?: string | null;
  specialInstructions?: string | null;
}

export interface CancelDispatcherOrderRequest {
  reason: string;
  notes?: string | null;
}

export interface PartnerBusinessOption {
  id: string;
  name: string;
  businessType: string;
  phoneNumber?: string | null;
  email?: string | null;
  isActive: boolean;
  addressSummary?: string | null;
}

export interface CustomerOption {
  id: string;
  fullName: string;
  phoneNumber?: string | null;
  email?: string | null;
  addressSummary?: string | null;
}

export const dispatcherOrdersApi = {
  list: async (query?: OrderQueryParameters): Promise<PagedResponse<OrderListItemDto>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
      });
    }
    const res = await apiClient.get<ApiResponse<PagedResponse<OrderListItemDto>>>('/orders', { params });
    return res.data.data;
  },
  getById: async (id: string): Promise<OrderDetailsDto> => {
    const res = await apiClient.get<ApiResponse<OrderDetailsDto>>(`/orders/${id}`);
    return res.data.data;
  },
  create: async (req: CreateDispatcherOrderRequest): Promise<OrderDetailsDto> => {
    const res = await apiClient.post<ApiResponse<OrderDetailsDto>>('/orders', req);
    return res.data.data;
  },
  update: async (id: string, req: UpdateDispatcherOrderRequest): Promise<OrderDetailsDto> => {
    const res = await apiClient.put<ApiResponse<OrderDetailsDto>>(`/orders/${id}`, req);
    return res.data.data;
  },
  cancel: async (id: string, req: CancelDispatcherOrderRequest): Promise<OrderDetailsDto> => {
    const res = await apiClient.post<ApiResponse<OrderDetailsDto>>(`/orders/${id}/cancel`, req);
    return res.data.data;
  },
  listPartners: async (): Promise<PartnerBusinessOption[]> => {
    const res = await apiClient.get<ApiResponse<PartnerBusinessOption[]>>('/partner-businesses');
    return res.data.data;
  },
  listCustomers: async (): Promise<CustomerOption[]> => {
    const res = await apiClient.get<ApiResponse<CustomerOption[]>>('/customers');
    return res.data.data;
  }
};
