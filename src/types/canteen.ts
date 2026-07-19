export interface Point { x: number; y: number }
export interface CanteenTable { id: string; name: string; statusId: number; seatCount: number; detectionPolygon: Point[]; interfacePolygon: Point[] }
export interface Canteen { id: string; name: string; createdAt: string; updatedAt: string; canteenTables: CanteenTable[] }
export type TableStatus = 0 | 1 | 2;
export interface TableStatusUpdate { tableId: string; statusId: TableStatus }
