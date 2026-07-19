import type { TableStatus } from '../types/canteen';
export const statusInfo: Record<TableStatus, { label: string; color: string; hex: string }> = {
  0: { label: 'Unknown', color: 'bg-slate-400', hex: '#94a3b8' },
  1: { label: 'Available', color: 'bg-emerald-500', hex: '#10b981' },
  2: { label: 'Occupied', color: 'bg-rose-500', hex: '#f43f5e' },
};
export const occupancy = (statuses: TableStatus[]) => ({ available: statuses.filter(x => x === 1).length, total: statuses.length });
