import * as THREE from 'three';
import type { Point } from '../types/canteen';
export function polygonShape(points: Point[]) { const shape = new THREE.Shape(); points.forEach((p, i) => i ? shape.lineTo(p.x, -p.y) : shape.moveTo(p.x, -p.y)); shape.closePath(); return shape; }
