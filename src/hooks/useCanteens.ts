import { useQuery } from '@tanstack/react-query';
import { getCanteens } from '../services/api';

export function useCanteens() {
  return useQuery({
    queryKey: ['canteens'],
    queryFn: getCanteens,
  });
}
