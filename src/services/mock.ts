import type { Canteen } from '../types/canteen';
const rectangle = (x: number, y: number, w: number, h: number) => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
const tables = [
  ['North 01', 1, 4, 130, 130], ['North 02', 2, 4, 340, 130], ['North 03', 1, 2, 550, 130],
  ['Garden 01', 1, 6, 130, 310], ['Garden 02', 2, 4, 370, 310], ['Garden 03', 0, 4, 590, 310],
  ['Window 01', 1, 2, 130, 500], ['Window 02', 1, 4, 350, 500], ['Window 03', 2, 4, 570, 500],
] as const;
export const mockCanteen: Canteen = { id: 'canteen-a', name: 'Canteen A', createdAt: '2026-07-19T06:42:10Z', updatedAt: '2026-07-19T06:42:10Z', canteenTables: tables.map(([name, statusId, seatCount, x, y], index) => ({ id: `table-${index + 1}`, name, statusId, seatCount, detectionPolygon: [], interfacePolygon: rectangle(x, y, 150, 105) })) };
