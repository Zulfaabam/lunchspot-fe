import type { Canteen } from '../types/canteen';

const rectangle = (x: number, y: number, w: number, h: number) => [
  { x, y },
  { x: x + w, y },
  { x: x + w, y: y + h },
  { x, y: y + h },
];

const tablesA = [
  ['North 01', 1, 4, 130, 130],
  ['North 02', 2, 4, 340, 130],
  ['North 03', 1, 2, 550, 130],
  ['Garden 01', 1, 6, 130, 310],
  ['Garden 02', 2, 4, 370, 310],
  ['Garden 03', 0, 4, 590, 310],
  ['Window 01', 1, 2, 130, 500],
  ['Window 02', 1, 4, 350, 500],
  ['Window 03', 2, 4, 570, 500],
] as const;

export const mockCanteenA: Canteen = {
  id: 'canteen-a',
  name: 'Canteen A - Main Hall',
  location: 'Jakarta HQ Building A',
  floor: 'Floor 1',
  description: 'Main cafeteria featuring Asian cuisine, salad bar, and live cooking stations.',
  operatingHours: '07:30 - 20:00',
  createdAt: '2026-07-19T06:42:10Z',
  updatedAt: '2026-07-20T09:10:00Z',
  canteenTables: tablesA.map(([name, statusId, seatCount, x, y], index) => ({
    id: `table-a-${index + 1}`,
    name,
    statusId,
    seatCount,
    detectionPolygon: [],
    interfacePolygon: rectangle(x, y, 150, 105),
  })),
};

const tablesB = [
  ['Tech 01', 0, 4, 130, 130],
  ['Tech 02', 1, 4, 340, 130],
  ['Tech 03', 0, 2, 550, 130],
  ['Lounge 01', 0, 6, 130, 310],
  ['Lounge 02', 1, 4, 370, 310],
  ['Lounge 03', 0, 4, 590, 310],
] as const;

export const mockCanteenB: Canteen = {
  id: 'canteen-b',
  name: 'Canteen B - Tech Hub Cafe',
  location: 'Jakarta HQ Tower 2',
  floor: 'Floor 3',
  description: 'Specialty coffee, artisanal pastries, and quiet booths for tech teams.',
  operatingHours: '08:00 - 18:30',
  createdAt: '2026-07-19T08:15:00Z',
  updatedAt: '2026-07-20T09:12:00Z',
  canteenTables: tablesB.map(([name, statusId, seatCount, x, y], index) => ({
    id: `table-b-${index + 1}`,
    name,
    statusId,
    seatCount,
    detectionPolygon: [],
    interfacePolygon: rectangle(x, y, 150, 105),
  })),
};

const tablesC = [
  ['Veranda 01', 2, 4, 130, 130],
  ['Veranda 02', 2, 4, 340, 130],
  ['Veranda 03', 1, 2, 550, 130],
  ['Courtyard 01', 2, 6, 130, 310],
  ['Courtyard 02', 2, 4, 370, 310],
  ['Courtyard 03', 1, 4, 590, 310],
  ['Patio 01', 2, 4, 130, 500],
  ['Patio 02', 1, 2, 350, 500],
] as const;

export const mockCanteenC: Canteen = {
  id: 'canteen-c',
  name: 'Canteen C - Garden Terrace',
  location: 'Jakarta HQ Annex',
  floor: 'Ground Floor Outdoor',
  description: 'Open-air garden dining with fresh grill options and healthy bowls.',
  operatingHours: '11:00 - 16:00',
  createdAt: '2026-07-19T09:30:00Z',
  updatedAt: '2026-07-20T09:14:00Z',
  canteenTables: tablesC.map(([name, statusId, seatCount, x, y], index) => ({
    id: `table-c-${index + 1}`,
    name,
    statusId,
    seatCount,
    detectionPolygon: [],
    interfacePolygon: rectangle(x, y, 150, 105),
  })),
};

export const mockCanteenList: Canteen[] = [mockCanteenA, mockCanteenB, mockCanteenC];
export const mockCanteen = mockCanteenA;
