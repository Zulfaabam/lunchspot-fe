export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  fieldErrors: Record<string, string[]> | null;
}

export interface PagedResponseDto<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
