import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import type { CanteenTable } from '../../../types/canteen'
import { TableMesh } from './TableMesh'

export function ThreeLayout({
  tables,
  onSelect,
}: {
  tables: CanteenTable[]
  onSelect: (table: CanteenTable) => void
}) {
  return (
    <div className='layout-surface three'>
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
          })
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[550, 780, 680]}
          zoom={0.85}
        />
        <ambientLight intensity={1.6} />
        <directionalLight
          position={[300, 500, 200]}
          intensity={1.5}
          castShadow
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[450, -3, 365]}
          receiveShadow
        >
          <planeGeometry args={[1050, 850]} />
          <meshStandardMaterial color='#f1f5f9' />
        </mesh>
        {tables.map((t) => (
          <TableMesh key={t.id} table={t} onSelect={onSelect} />
        ))}
        <OrbitControls
          makeDefault
          enableRotate
          target={[450, 0, 365]}
          minZoom={0.45}
          maxZoom={1.7}
        />
      </Canvas>
    </div>
  )
}
