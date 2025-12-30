// src/components/3d/Room.jsx - VERSÃO CORRIGIDA
import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Sky, Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function Room({ config, roomName, photosCount = 0 }) {
  const roomRef = useRef();
  const wallsRef = useRef();
  const floorRef = useRef();
  const ceilingRef = useRef();
  const particlesRef = useRef();
  const { scene, camera } = useThree();
  
  const [lightsOn, setLightsOn] = useState(true);
  const [particles, setParticles] = useState([]);

  // Configurações específicas por sala - REMOVIDOS ARQUIVOS HDRI
  const roomThemes = useMemo(() => ({
    'Sala do Amor': {
      wallColor: '#1A0000',
      floorColor: '#2A0000',
      ceilingColor: '#0A0000',
      accentColor: '#FF6B8B',
      lightColor: '#FFB6C1',
      fogColor: '#330000',
      fogDensity: 0.002,
      particleShape: 'hearts',
      particleColor: '#FF6B8B',
      decorations: ['roses', 'candles', 'hearts'],
      music: '/assets/audio/love_theme.mp3',
      ambientLight: 0.3,
      spotlights: 3
    },
    'Sala dos Momentos': {
      wallColor: '#1A1A1A',
      floorColor: '#2A2A2A',
      ceilingColor: '#0A0A0A',
      accentColor: '#D4AF37',
      lightColor: '#FFF8DC',
      fogColor: '#333333',
      fogDensity: 0.001,
      particleShape: 'sparkles',
      particleColor: '#D4AF37',
      decorations: ['clocks', 'frames', 'books'],
      music: '/assets/audio/moments_theme.mp3',
      ambientLight: 0.4,
      spotlights: 4
    },
    'Sala dos Sorrisos': {
      wallColor: '#2A2000',
      floorColor: '#3A3000',
      ceilingColor: '#1A1000',
      accentColor: '#FFD700',
      lightColor: '#FFFFE0',
      fogColor: '#664400',
      fogDensity: 0.0015,
      particleShape: 'stars',
      particleColor: '#FFD700',
      decorations: ['smileys', 'balloons', 'confetti'],
      music: '/assets/audio/smiles_theme.mp3',
      ambientLight: 0.5,
      spotlights: 5
    },
    'Sala das Memórias': {
      wallColor: '#0A1A1A',
      floorColor: '#1A2A2A',
      ceilingColor: '#000A0A',
      accentColor: '#87CEEB',
      lightColor: '#E0FFFF',
      fogColor: '#006666',
      fogDensity: 0.002,
      particleShape: 'snowflakes',
      particleColor: '#87CEEB',
      decorations: ['photos', 'letters', 'keepsakes'],
      music: '/assets/audio/memories_theme.mp3',
      ambientLight: 0.35,
      spotlights: 3
    },
    'Sala Vermelha': {
      wallColor: '#300000',
      floorColor: '#400000',
      ceilingColor: '#200000',
      accentColor: '#FF0000',
      lightColor: '#FFCCCB',
      fogColor: '#660000',
      fogDensity: 0.0025,
      particleShape: 'petals',
      particleColor: '#FF6B8B',
      decorations: ['velvet', 'crystals', 'roses'],
      music: '/assets/audio/red_theme.mp3',
      ambientLight: 0.25,
      spotlights: 2
    },
    'Sala Golden Hour': {
      wallColor: '#2A2000',
      floorColor: '#3A3000',
      ceilingColor: '#1A1000',
      accentColor: '#FFD700',
      lightColor: '#FFEC8B',
      fogColor: '#FF8C00',
      fogDensity: 0.003,
      particleShape: 'sunbeams',
      particleColor: '#FFD700',
      decorations: ['sunflowers', 'gold', 'mirrors'],
      music: '/assets/audio/golden_theme.mp3',
      ambientLight: 0.6,
      spotlights: 6
    }
  }), []);

  const theme = roomThemes[roomName] || roomThemes['Sala do Amor'];

  // Criar partículas atmosféricas
  useEffect(() => {
    const newParticles = [];
    const particleCount = 50; // Reduzido para melhor performance
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          Math.random() * 5,
          (Math.random() - 0.5) * 20
        ],
        size: Math.random() * 0.05 + 0.02,
        speed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * Math.PI * 2
      });
    }
    
    setParticles(newParticles);
  }, [roomName]);

  // Animação das partículas
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (particlesRef.current) {
      particles.forEach((particle, index) => {
        if (particlesRef.current.children[index]) {
          const child = particlesRef.current.children[index];
          
          // Movimento baseado no formato da partícula
          switch (theme.particleShape) {
            case 'hearts':
              child.position.y += Math.sin(time + particle.id) * 0.01;
              child.rotation.z = Math.sin(time * 2 + particle.id) * 0.5;
              break;
            case 'sparkles':
              child.position.y += Math.sin(time * 3 + particle.id) * 0.02;
              child.rotation.x += 0.02;
              child.rotation.y += 0.01;
              break;
            case 'petals':
              child.position.x += Math.sin(time + particle.id) * 0.01;
              child.position.y -= particle.speed;
              child.rotation.z += 0.03;
              break;
            default:
              child.position.y += Math.sin(time + particle.id) * 0.005;
          }
          
          // Reposicionar se sair da sala
          if (child.position.y < -2) {
            child.position.y = 5;
          }
        }
      });
    }
    
    // Efeito de respiração nas luzes
    if (wallsRef.current && lightsOn) {
      const intensity = 0.5 + Math.sin(time * 0.5) * 0.1;
      wallsRef.current.children.forEach(light => {
        if (light.isPointLight) {
          light.intensity = intensity;
        }
      });
    }
  });

  // Criar luzes spot
  const createSpotLights = () => {
    const lights = [];
    const count = theme.spotlights;
    const radius = 4;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      lights.push(
        <pointLight
          key={`spot-${i}`}
          position={[x, 4, z]}
          intensity={lightsOn ? 0.8 : 0}
          color={theme.lightColor}
          distance={10}
          decay={2}
          castShadow
        />
      );
    }
    
    return lights;
  };

  // Criar decorações da sala
  const createDecorations = () => {
    const decorations = [];
    
    theme.decorations.forEach((decoration, index) => {
      const angle = (index / theme.decorations.length) * Math.PI * 2;
      const radius = 4.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 2.5;
      
      switch (decoration) {
        case 'roses':
          decorations.push(
            <mesh key={`rose-${index}`} position={[x, y, z]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color="#FF6B8B"
                emissive="#FF6B8B"
                emissiveIntensity={0.2}
              />
            </mesh>
          );
          break;
          
        case 'candles':
          decorations.push(
            <group key={`candle-${index}`} position={[x, 1, z]}>
              <mesh>
                <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              {lightsOn && (
                <mesh position={[0, 0.4, 0]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshBasicMaterial
                    color={theme.accentColor}
                    emissive={theme.accentColor}
                    emissiveIntensity={2}
                  />
                </mesh>
              )}
            </group>
          );
          break;
          
        case 'frames':
          decorations.push(
            <mesh key={`frame-${index}`} position={[x, y, z]} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.6, 0.8, 0.05]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} />
            </mesh>
          );
          break;
      }
    });
    
    return decorations;
  };

  // Criar partículas 3D
  const createParticles3D = () => {
    return particles.map((particle) => {
      let geometry;
      
      switch (theme.particleShape) {
        case 'hearts':
          geometry = <sphereGeometry args={[particle.size, 8, 8]} />;
          break;
        case 'sparkles':
          geometry = <tetrahedronGeometry args={[particle.size]} />;
          break;
        case 'stars':
          geometry = <octahedronGeometry args={[particle.size]} />;
          break;
        default:
          geometry = <sphereGeometry args={[particle.size, 8, 8]} />;
      }
      
      return (
        <mesh
          key={particle.id}
          position={particle.position}
          rotation={[
            particle.rotation,
            particle.rotation * 1.5,
            particle.rotation * 0.5
          ]}
        >
          {geometry}
          <meshBasicMaterial
            color={theme.particleColor}
            transparent
            opacity={0.6}
          />
        </mesh>
      );
    });
  };

  return (
    <group ref={roomRef}>
      {/* Ambiente com cor sólida em vez de HDRI */}
      <color attach="background" args={[theme.fogColor]} />
      <fog attach="fog" args={[theme.fogColor, 5, 15]} />
      
      {/* Sala principal */}
      <group>
        {/* Paredes */}
        <mesh ref={wallsRef} receiveShadow>
          <boxGeometry args={[12, 5, 12]} />
          <meshStandardMaterial
            color={theme.wallColor}
            roughness={0.8}
            metalness={0.2}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Chão */}
        <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial
            color={theme.floorColor}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        
        {/* Teto */}
        <mesh ref={ceilingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial
            color={theme.ceilingColor}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </group>
      
      {/* Iluminação principal */}
      <ambientLight intensity={theme.ambientLight} color={theme.lightColor} />
      
      {/* Luzes spot */}
      {createSpotLights()}
      
      {/* Luz de destaque central */}
      <pointLight
        position={[0, 4, 0]}
        intensity={lightsOn ? 1 : 0}
        color={theme.accentColor}
        distance={15}
        decay={1.5}
      />
      
      {/* Grupo de partículas */}
      <group ref={particlesRef}>
        {createParticles3D()}
      </group>
      
      {/* Decorações */}
      {createDecorations()}
      
      {/* Placa com nome da sala */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.4}
          color={theme.accentColor}
          font="/fonts/Cinzel-Bold.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {roomName}
        </Text>
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.15}
          color={theme.lightColor}
          font="/fonts/Inter-Regular.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {photosCount} memória{photosCount !== 1 ? 's' : ''}
        </Text>
      </Float>
      
      {/* Elementos interativos */}
      <Html
        position={[4, 2, 0]}
        distanceFactor={10}
      >
        <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3">
          <button
            onClick={() => setLightsOn(!lightsOn)}
            className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {lightsOn ? '💡' : '🌙'}
            <span className="text-sm">{lightsOn ? 'Atenuar' : 'Acender'}</span>
          </button>
        </div>
      </Html>
      
      {/* Faixa de luz no chão */}
      {lightsOn && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.45, 0]}>
          <ringGeometry args={[3, 4, 32]} />
          <meshBasicMaterial
            color={theme.accentColor}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}