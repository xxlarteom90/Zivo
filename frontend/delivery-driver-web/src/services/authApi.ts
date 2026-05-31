import { apiClient } from './apiClient';
import type { ApiResponse } from '../entities/api';
import type { AuthenticatedUser, AuthResponse, LoginRequest } from '../entities/auth';

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', request);
  return response.data.data;
}

export async function getMe(): Promise<AuthenticatedUser> {
  const response = await apiClient.get<ApiResponse<AuthenticatedUser>>('/me');
  return response.data.data;
}
