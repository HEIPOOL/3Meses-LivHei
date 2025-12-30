// src/components/3d/Painting.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, LinearFilter } from 'three';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function Painting({ 
  photo, 
  position = [0, 1.5, 0], 
  rotation = [0, 0, 0],
  onClick,
  scale = 1
}) {
  const meshRef = useRef();
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [texture, setTexture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar textura da imagem
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      photo.url,
      (loadedTexture) => {
        loadedTexture.minFilter = LinearFilter;
        loadedTexture.generateMipmaps = false;
        setTexture(loadedTexture);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar textura:', error);
        setLoading(false);
      }
    );
  }, [photo.url]);

  // Animação do quadro
  useFrame((state) => {
    if (meshRef.current) {
      // Flutuação suave
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      
      // Rotação sutil no hover
      if (hovered) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          rotation[1] + 0.05,
          0.1
        );
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          rotation[1],
          0.1
        );
      }

      // Efeito de click
      if (clicked) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 0.9 * scale, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0.9 * scale, 0.1);
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.05 * scale : 1 * scale, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, hovered ? 1.05 * scale : 1 * scale, 0.1);
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    if (onClick) onClick();
  };

  // Tamanhos base para o quadro
  const frameWidth = 2 * scale;
  const frameHeight = 2.5 * scale;
  const frameDepth = 0.15 * scale;
  const imageWidth = 1.8 * scale;
  const imageHeight = 2.3 * scale;
  const borderWidth = 0.1 * scale;

  if (loading) {
    return (
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[frameWidth, frameHeight, frameDepth]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>
        <Html center>
          <div className="text-white text-xs bg-black/50 p-2 rounded">
            Carregando...
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group 
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        setClicked(false);
      }}
      castShadow
      receiveShadow
    >
      {/* Moldura principal */}
      <mesh ref={frameRef} castShadow>
        <boxGeometry args={[frameWidth, frameHeight, frameDepth]} />
        <meshStandardMaterial
          color="#8B0000"
          metalness={0.7}
          roughness={0.3}
          emissive={hovered ? '#FF6B8B' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Borda interna decorativa */}
      <mesh position={[0, 0, 0.076]}>
        <boxGeometry args={[frameWidth - 0.05, frameHeight - 0.05, 0.02]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Imagem interna */}
      {texture && (
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[imageWidth, imageHeight]} />
          <meshBasicMaterial 
            map={texture}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Vidro/Proteção */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[imageWidth - 0.02, imageHeight - 0.02]} />
        <meshPhysicalMaterial
          transmission={0.9}
          thickness={0.1}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          color="#ffffff"
          ior={1.5}
        />
      </mesh>

      {/* Efeito de brilho ao redor no hover */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          intensity={0.5}
          color="#FF6B8B"
          distance={3}
        />
      )}

      {/* Placa de identificação */}
      <mesh position={[0, -frameHeight/2 - 0.2, 0.1]}>
        <boxGeometry args={[frameWidth * 0.8, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Texto da placa (usando HTML overlay) */}
      <Html
        position={[0, -frameHeight/2 - 0.2, 0.11]}
        center
        distanceFactor={10}
      >
        <div className="text-center transform -translate-y-1/2">
          <p className="text-white text-xs font-bold whitespace-nowrap px-2 py-1 bg-black/50 rounded">
            {photo.title}
          </p>
        </div>
      </Html>

      {/* Indicador de interação (apenas no hover) */}
      {hovered && (
        <Html
          position={[0, frameHeight/2 + 0.3, 0.11]}
          center
          distanceFactor={15}
        >
          <div className="text-center animate-pulse">
            <div className="text-white text-sm bg-[var(--color-primary)]/80 px-3 py-1 rounded-full">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Clique para ampliar
              </span>
            </div>
          </div>
        </Html>
      )}

      {/* Efeito de partículas no hover */}
      {hovered && (
        <points>
          <sphereGeometry args={[frameWidth * 0.6, 16, 16]} />
          <pointsMaterial
            size={0.05}
            color="#FF6B8B"
            transparent
            opacity={0.3}
            sizeAttenuation
          />
        </points>
      )}

      {/* Linhas de destaque na moldura */}
      <group>
        {/* Topo */}
        <mesh position={[0, frameHeight/2 - 0.02, 0.06]}>
          <boxGeometry args={[frameWidth * 0.9, 0.04, 0.01]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={hovered ? 0.5 : 0.2} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -frameHeight/2 + 0.02, 0.06]}>
          <boxGeometry args={[frameWidth * 0.9, 0.04, 0.01]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={hovered ? 0.5 : 0.2} />
        </mesh>
      </group>
    </group>
  );
}