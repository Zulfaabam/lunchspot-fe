import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
export const createCanteenConnection = () => new HubConnectionBuilder().withUrl(import.meta.env.VITE_SIGNALR_URL ?? '/hubs/canteen').withAutomaticReconnect().configureLogging(LogLevel.Warning).build();
export { HubConnectionState };
