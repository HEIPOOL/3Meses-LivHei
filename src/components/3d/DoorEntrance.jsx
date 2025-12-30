// src/components/3d/DoorEntrance.jsx - CORRIGIDO
import * as THREE from 'three'; // ADICIONAR ESTA LINHA
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

export default function DoorEntrance({ state, onClick, position, scale }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animações baseadas no estado
  useFrame(() => {
    if (meshRef.current) {
      // Animação de abertura
      if (state === 'opening') {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          Math.PI / 3,
          0.05
        );
      } else if (state === 'open') {
        meshRef.current.rotation.y = Math.PI / 2;
      } else {
        meshRef.current.rotation.y = 0;
      }
      
      // Pulsação quando hover
      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1.05,
          0.1
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.05,
          0.1
        );
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1,
          0.1
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1,
          0.1
        );
      }
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Moldura da porta */}
      <Box
        ref={meshRef}
        args={[2, 3, 0.1]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#FF6B8B" : "#D4AF37"}
          emissive={hovered ? "#FF6B8B" : "#000000"}
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.6}
        />
      </Box>
      
      {/* Detalhe da maçaneta */}
      <mesh
        position={[0.8, 0, 0.06]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Placa com texto */}
      <Text
        position={[0, 1, 0.11]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        Entrar
      </Text>
    </group>
  );
}