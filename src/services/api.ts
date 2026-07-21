import axios from 'axios';
import type { Canteen, CanteenTable } from '../types/canteen';
import type { ApiResponseDto, PagedResponseDto } from '../types/api';
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

// Helper to map backend table data to frontend CanteenTable format
function mapBackendTable(backendTable: any): CanteenTable {
  let statusId = 0; // Unknown
  if (backendTable.status?.name === 'Available') statusId = 1;
  else if (backendTable.status?.name === 'Occupied') statusId = 2;

  return {
    id: backendTable.id,
    name: backendTable.name || 'Table',
    statusId: statusId,
    seatCount: backendTable.seatCount || 4, // Default if missing
    detectionPolygon: backendTable.points || [],
    interfacePolygon: backendTable.points || [],
  };
}

// Helper to map backend canteen data
function mapBackendCanteen(backendCanteen: any): Canteen {
  return {
    ...backendCanteen,
    location: backendCanteen.location || 'Unknown Location',
    floor: backendCanteen.floor || '1st Floor',
    description: backendCanteen.description || '',
    operatingHours: backendCanteen.operatingHours || '08:00 - 17:00',
    canteenTables: (backendCanteen.canteenTables || []).map(mapBackendTable),
  };
}

export async function getCanteens(): Promise<Canteen[]> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    return new Promise((resolve) => setTimeout(() => resolve(mockCanteenList), 400));
  }
  const response = await api.get<ApiResponseDto<PagedResponseDto<any>>>('/Canteen?pageNumber=1&pageSize=100');
  const items = response.data.data?.data || [];
  return items.map(mapBackendCanteen);
}

export async function getCanteen(id: string): Promise<Canteen> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    const found = mockCanteenList.find((c) => c.id === id);
    return new Promise((resolve) => setTimeout(() => resolve(found || mockCanteenA), 400));
  }
  const response = await api.get<ApiResponseDto<any>>(`/Canteen/${id}`);
  return mapBackendCanteen(response.data.data);
}

export async function createCanteen(name: string): Promise<Canteen> {
  const response = await api.post<ApiResponseDto<any>>('/Canteen', { name });
  return mapBackendCanteen(response.data.data);
}

export async function updateCanteen(id: string, name: string): Promise<Canteen> {
  const response = await api.put<ApiResponseDto<any>>(`/Canteen/${id}`, { name });
  return mapBackendCanteen(response.data.data);
}

export async function deleteCanteen(id: string): Promise<void> {
  await api.delete(`/Canteen/${id}`);
}
