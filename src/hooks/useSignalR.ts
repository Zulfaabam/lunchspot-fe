import { useEffect, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { canteenKey } from './useCanteen';
import { createCanteenConnection, HubConnectionState } from '../services/signalr';
import type { Canteen, TableStatusUpdate } from '../types/canteen';
export type ConnectionStatus = 'live' | 'reconnecting' | 'disconnected';
export function useSignalR(canteenId: string, queryClient: QueryClient) { const [status, setStatus] = useState<ConnectionStatus>(import.meta.env.VITE_USE_MOCK !== 'false' ? 'live' : 'disconnected');
 useEffect(() => { if (import.meta.env.VITE_USE_MOCK !== 'false') return; const connection = createCanteenConnection(); connection.on('TableStatusUpdated', (payload: TableStatusUpdate) => queryClient.setQueryData<Canteen>(canteenKey(canteenId), old => old && ({ ...old, updatedAt: new Date().toISOString(), canteenTables: old.canteenTables.map(t => t.id === payload.tableId ? { ...t, statusId: payload.statusId } : t) }))); connection.onreconnecting(() => setStatus('reconnecting')); connection.onreconnected(() => setStatus('live')); connection.onclose(() => setStatus('disconnected')); connection.start().then(() => { if (connection.state === HubConnectionState.Connected) setStatus('live'); }).catch(() => setStatus('disconnected')); return () => { connection.stop(); }; }, [canteenId, queryClient]); return status; }
