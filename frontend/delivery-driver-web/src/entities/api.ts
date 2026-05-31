export interface ApiResponse<T> {
  data: T;
  traceId: string;
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
  traceId: string;
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiErrorViewModel {
  code: string;
  message: string;
  details?: string[];
  traceId?: string;
  status?: number;
}
