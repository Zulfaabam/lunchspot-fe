import type { Point } from '../types/canteen';
export const polygonPoints = (points: Point[]) => points.map(({ x, y }) => `${x},${y}`).join(' ');
export const centroid = (points: Point[]) => points.reduce((a, point) => ({ x: a.x + point.x / points.length, y: a.y + point.y / points.length }), { x: 0, y: 0 });
export const layoutBounds = (polygons: Point[][]) => { const p = polygons.flat(); const xs = p.map(x => x.x); const ys = p.map(x => x.y); return { minX: Math.min(...xs) - 90, minY: Math.min(...ys) - 90, width: Math.max(...xs) - Math.min(...xs) + 180, height: Math.max(...ys) - Math.min(...ys) + 180 }; };
