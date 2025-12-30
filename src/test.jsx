// src/test.jsx - Teste rápido
import DoorEntrance from '@/components/3d/DoorEntrance';
import { Canvas } from '@react-three/fiber';

function TestPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <DoorEntrance state="closed" onClick={() => console.log('clicked')} />
      </Canvas>
    </div>
  );
}

export default TestPage;