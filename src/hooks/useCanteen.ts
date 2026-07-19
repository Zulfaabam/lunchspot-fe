import { useQuery } from '@tanstack/react-query';
import { getCanteen } from '../services/api';
export const canteenKey = (id: string) => ['canteen', id] as const;
export const useCanteen = (id: string) => useQuery({ queryKey: canteenKey(id), queryFn: () => getCanteen(id), staleTime: Infinity });
