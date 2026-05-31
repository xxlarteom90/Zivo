import type { AddressDto } from './address';
import type { CustomerSummaryDto } from './customer';
import type { PartnerBusinessSummaryDto } from './partnerBusiness';

export type OrderStatus = 'Available' | 'Accepted' | 'PickedUp' | 'Delivered' | 'Cancelled';
export type OrderAction = 'Accept' | 'MarkPickedUp' | 'MarkDelivered' | 'Cancel';

export interface OrderListItemDto {
  id: string;
  publicOrderNumber: string;
  status: OrderStatus;
  partnerBusinessName: string;
  customerName: string;
  pickupAddressSummary: string;
  deliveryAddressSummary: string;
  pickupWindowStartUtc?: string | null;
  pickupWindowEndUtc?: string | null;
  deliveryWindowStartUtc?: string | null;
  deliveryWindowEndUtc?: string | null;
  itemSummary: string;
  hasSpecialInstructions: boolean;
}

export interface OrderItemDto {
  id: string;
  itemType: string;
  description: string;
  quantity: number;
  estimatedWeightKg?: number | null;
  notes?: string | null;
}

export interface OrderAssignmentDto {
  driverId: string;
  driverName: string;
  acceptedAtUtc: string;
  pickedUpAtUtc?: string | null;
  deliveredAtUtc?: string | null;
}

export interface OrderStatusHistoryDto {
  id: string;
  fromStatus?: string | null;
  toStatus: string;
  changedBy: string;
  changedAtUtc: string;
  reason?: string | null;
  notes?: string | null;
}

export interface OrderDetailsDto {
  id: string;
  publicOrderNumber: string;
  status: OrderStatus;
  partnerBusiness: PartnerBusinessSummaryDto;
  customer: CustomerSummaryDto;
  pickupAddress: AddressDto;
  deliveryAddress: AddressDto;
  items: OrderItemDto[];
  assignment?: OrderAssignmentDto | null;
  statusHistory: OrderStatusHistoryDto[];
  availableActions: OrderAction[];
  pickupWindowStartUtc?: string | null;
  pickupWindowEndUtc?: string | null;
  deliveryWindowStartUtc?: string | null;
  deliveryWindowEndUtc?: string | null;
  notes?: string | null;
  specialInstructions?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface OrderQueryParameters {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
