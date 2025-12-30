// src/components/3d/LightSetup.jsx
import { useThree } from '@react-three/fiber';

export default function LightSetup({ config }) {
  const { scene } = useThree();
  
  return (
    <>
      <ambientLight intensity={0.4} color={config.lighting === 'warm' ? '#FFEEDD' : '#FFFFFF'} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 3, 0]} intensity={0.3} color={config.particleColor} />
    </>
  );
}