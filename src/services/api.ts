import axios from 'axios'
import type { Canteen } from '../types/canteen'
import { mockCanteen } from './mock'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})
export async function getCanteen(id: string): Promise<Canteen> {
  if (import.meta.env.VITE_USE_MOCK !== 'false')
    return new Promise((resolve) => setTimeout(() => resolve(mockCanteen), 650))
  return (await api.get<Canteen>(`/canteens/${id}`)).data
}
