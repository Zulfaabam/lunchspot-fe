import { api } from './api'
import type { ApiResponseDto } from '../types/api'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
}

export async function loginApi(
  email: string,
  password?: string,
): Promise<ApiResponseDto<LoginResponse>> {
  const response = await api.post<ApiResponseDto<LoginResponse>>(
    '/Auth/login',
    { email, password },
  )
  return response.data
}

export async function logoutApi(): Promise<ApiResponseDto<null>> {
  const response = await api.post<ApiResponseDto<null>>('/Auth/logout')
  return response.data
}
