import { useQuery } from '@tanstack/react-query';
import { getCanteen, getCanteens } from '../services/api';
export const canteenKey = (id: string) => ['canteen', id] as const;
export const canteensListKey = ['canteens', 'list'] as const;
export const useCanteen = (id: string) => useQuery({ queryKey: canteenKey(id), queryFn: () => getCanteen(id), staleTime: Infinity, enabled: !!id });
export const useCanteens = () => useQuery({ queryKey: canteensListKey, queryFn: getCanteens, staleTime: Infinity });
