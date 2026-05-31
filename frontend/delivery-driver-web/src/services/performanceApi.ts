import { apiClient } from './apiClient';
import type { ApiResponse } from '../entities/api';
import type { DriverPerformanceDto, PerformancePeriod } from '../entities/performance';

export const performanceApi = {
  get: async (period: PerformancePeriod): Promise<DriverPerformanceDto> => {
    const response = await apiClient.get<ApiResponse<DriverPerformanceDto>>('/driver/performance', {
      params: { period }
    });
    return response.data.data;
  }
};
