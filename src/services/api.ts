import axios from 'axios';
import type { Canteen } from '../types/canteen';
import { mockCanteenList, mockCanteenA } from './mock';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:57679/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lunchspot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getCanteens(): Promise<Canteen[]> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    return new Promise((resolve) => setTimeout(() => resolve(mockCanteenList), 400));
  }
  return (await api.get<Canteen[]>('/canteens')).data;
}

export async function getCanteen(id: string): Promise<Canteen> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    const found = mockCanteenList.find((c) => c.id === id);
    return new Promise((resolve) => setTimeout(() => resolve(found || mockCanteenA), 400));
  }
  return (await api.get<Canteen>(`/canteens/${id}`)).data;
}
