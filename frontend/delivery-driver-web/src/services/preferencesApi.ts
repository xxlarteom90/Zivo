import { apiClient } from './apiClient';
import type { ApiResponse } from '../entities/api';

export interface UserPreferencesDto {
  language: string;
  appearance: 'system' | 'light' | 'dark';
  reducedMotion: boolean;
  vehicleType: 'car' | 'bike' | 'foot';
  navigationApp: 'Waze' | 'Google Maps' | 'Apple Maps';
}

export interface UpdateUserPreferencesRequest {
  language?: string;
  appearance?: 'system' | 'light' | 'dark';
  reducedMotion?: boolean;
  vehicleType?: 'car' | 'bike' | 'foot';
  navigationApp?: 'Waze' | 'Google Maps' | 'Apple Maps';
}

export async function getPreferences(): Promise<UserPreferencesDto> {
  const { data } = await apiClient.get<ApiResponse<UserPreferencesDto>>('/me/preferences');
  return data.data;
}

export async function updatePreferences(payload: UpdateUserPreferencesRequest): Promise<UserPreferencesDto> {
  const { data } = await apiClient.put<ApiResponse<UserPreferencesDto>>('/me/preferences', payload);
  return data.data;
}
