import { memo, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import type { CanteenTable } from '../../../types/canteen';
import { polygonShape } from '../../../utils/geometry';
import { centroid } from '../../../utils/polygon';
import { statusInfo } from '../../../utils/status';

export const TableMesh = memo(function TableMesh({
  table,
  onSelect,
}: {
  table: CanteenTable;
  onSelect: (table: CanteenTable) => void;
}) {
  const shape = useMemo(
    () => polygonShape(table.interfacePolygon),
    [table.interfacePolygon]
  );

  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: 18,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 2,
      bevelSegments: 2,
    });
  }, [shape]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '700 36px "DM Sans", ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#172033';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(table.name, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [table.name]);

  useEffect(() => {
    return () => {
      textTexture?.dispose();
    };
  }, [textTexture]);

  const c = useMemo(
    () => centroid(table.interfacePolygon),
    [table.interfacePolygon]
  );

  const s = statusInfo[table.statusId as 0 | 1 | 2] ?? statusInfo[0];

  return (
    <group onClick={() => onSelect(table)}>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={s.hex} roughness={0.38} metalness={0.05} />
      </mesh>
      {textTexture && (
        <mesh position={[c.x, 20.5, c.y]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[90, 45]} />
          <meshBasicMaterial map={textTexture} transparent alphaTest={0.05} />
        </mesh>
      )}
    </group>
  );
});
