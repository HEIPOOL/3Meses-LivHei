import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function InteractiveFrame({ 
  photo, 
  position = [0, 1.5, 0], 
  rotation = [0, 0, 0], 
  onClick,
  isActive = false,
  frameType = 'elegant' // 'elegant', 'modern', 'vintage', 'golden', 'romantic'
}) {
  const frameRef = useRef();
  const imageRef = useRef();
  const groupRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageTexture, setImageTexture] = useState(null);
  const { viewport } = useThree();

  // Configurações de frame por tipo
  const frameConfigs = useMemo(() => ({
    elegant: {
      frameColor: '#8B0000',
      frameMetalness: 0.8,
      frameRoughness: 0.3,
      accentColor: '#D4AF37',
      glowColor: '#FF6B8B',
      width: 1.8,
      height: 2.3,
      depth: 0.2,
      borderWidth: 0.1,
      ornament: true,
      glass: true
    },
    modern: {
      frameColor: '#2A2A2A',
      frameMetalness: 0.5,
      frameRoughness: 0.5,
      accentColor: '#FFFFFF',
      glowColor: '#8B0000',
      width: 2.0,
      height: 2.5,
      depth: 0.15,
      borderWidth: 0.05,
      ornament: false,
      glass: true
    },
    vintage: {
      frameColor: '#8B4513',
      frameMetalness: 0.3,
      frameRoughness: 0.8,
      accentColor: '#D4AF37',
      glowColor: '#D4AF37',
      width: 2.2,
      height: 2.8,
      depth: 0.25,
      borderWidth: 0.15,
      ornament: true,
      glass: false
    },
    golden: {
      frameColor: '#D4AF37',
      frameMetalness: 0.9,
      frameRoughness: 0.2,
      accentColor: '#8B0000',
      glowColor: '#FFD700',
      width: 1.9,
      height: 2.4,
      depth: 0.18,
      borderWidth: 0.08,
      ornament: true,
      glass: true
    },
    romantic: {
      frameColor: '#FF6B8B',
      frameMetalness: 0.6,
      frameRoughness: 0.4,
      accentColor: '#FFFFFF',
      glowColor: '#FF1493',
      width: 1.7,
      height: 2.2,
      depth: 0.12,
      borderWidth: 0.06,
      ornament: true,
      glass: true
    }
  }), []);

  const config = frameConfigs[frameType] || frameConfigs.elegant;

  // Carregar imagem
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      photo.url,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        setImageTexture(texture);
        setLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar imagem:', error);
        setLoaded(true);
      }
    );
  }, [photo.url]);

  // Animação do frame
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Flutuação suave
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.02;
      
      // Rotação no hover
      if (hovered) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          rotation[1] + 0.05,
          0.1
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          rotation[0] + 0.02,
          0.1
        );
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          rotation[1],
          0.1
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          rotation[0],
          0.1
        );
      }

      // Efeito de pulso quando ativo
      if (isActive) {
        const scale = 1 + Math.sin(time * 3) * 0.05;
        groupRef.current.scale.setScalar(scale);
      }

      // Efeito de brilho
      if (glowRef.current && hovered) {
        glowRef.current.intensity = 0.5 + Math.sin(time * 5) * 0.2;
      }
    }

    // Animação de imagem ao hover
    if (imageRef.current && hovered) {
      imageRef.current.position.z = 0.11 + Math.sin(state.clock.elapsedTime * 10) * 0.005;
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    if (onClick) onClick();
  };

  // Criar geometria ornamental
  const createOrnament = (position, size, rotation = 0) => {
    return (
      <mesh position={position} rotation={[0, 0, rotation]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={config.accentColor}
          metalness={0.9}
          roughness={0.1}
          emissive={hovered ? config.glowColor : config.accentColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
    );
  };

  // Criar cantos ornamentados
  const createCornerOrnaments = () => {
    const halfWidth = config.width / 2;
    const halfHeight = config.height / 2;
    
    return (
      <>
        {/* Cantos superiores */}
        {createOrnament([-halfWidth + 0.15, halfHeight - 0.15, 0.1], 0.08, Math.PI / 4)}
        {createOrnament([halfWidth - 0.15, halfHeight - 0.15, 0.1], 0.08, -Math.PI / 4)}
        
        {/* Cantos inferiores */}
        {createOrnament([-halfWidth + 0.15, -halfHeight + 0.15, 0.1], 0.08, -Math.PI / 4)}
        {createOrnament([halfWidth - 0.15, -halfHeight + 0.15, 0.1], 0.08, Math.PI / 4)}
        
        {/* Meios das bordas */}
        {createOrnament([0, halfHeight - 0.1, 0.1], 0.06)}
        {createOrnament([0, -halfHeight + 0.1, 0.1], 0.06)}
        {createOrnament([-halfWidth + 0.1, 0, 0.1], 0.06, Math.PI / 2)}
        {createOrnament([halfWidth - 0.1, 0, 0.1], 0.06, Math.PI / 2)}
      </>
    );
  };

  // Criar efeito de partículas
  const createParticles = () => {
    const particles = [];
    const particleCount = hovered ? 20 : 0;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * config.width * 1.2,
            (Math.random() - 0.5) * config.height * 1.2,
            0.5
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color={config.glowColor}
            emissive={config.glowColor}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      );
    }
    
    return particles;
  };

  // Efeito de clique
  useEffect(() => {
    if (clicked && groupRef.current) {
      groupRef.current.scale.setScalar(0.95);
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.scale.setScalar(1);
        }
      }, 200);
    }
  }, [clicked]);

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Moldura principal */}
      <mesh ref={frameRef} castShadow receiveShadow>
        <boxGeometry args={[config.width, config.height, config.depth]} />
        <meshStandardMaterial
          color={config.frameColor}
          metalness={config.frameMetalness}
          roughness={config.frameRoughness}
          emissive={hovered ? config.glowColor : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Borda interna */}
      <mesh position={[0, 0, config.depth / 2 + 0.01]}>
        <boxGeometry args={[
          config.width - config.borderWidth,
          config.height - config.borderWidth,
          0.02
        ]} />
        <meshStandardMaterial
          color={config.accentColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Imagem */}
      {loaded && imageTexture && (
        <mesh 
          ref={imageRef}
          position={[0, 0, config.depth / 2 + 0.02]}
        >
          <planeGeometry args={[
            config.width - config.borderWidth - 0.05,
            config.height - config.borderWidth - 0.05
          ]} />
          <meshBasicMaterial 
            map={imageTexture}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Overlay de carregamento */}
      {!loaded && (
        <mesh position={[0, 0, config.depth / 2 + 0.021]}>
          <planeGeometry args={[
            config.width - config.borderWidth - 0.05,
            config.height - config.borderWidth - 0.05
          ]} />
          <meshBasicMaterial color="#2A2A2A" />
        </mesh>
      )}

      {/* Vidro/Proteção */}
      {config.glass && (
        <mesh position={[0, 0, config.depth / 2 + 0.03]}>
          <planeGeometry args={[
            config.width - config.borderWidth - 0.05,
            config.height - config.borderWidth - 0.05
          ]} />
          <meshPhysicalMaterial
            transmission={0.95}
            thickness={0.5}
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#ffffff"
            ior={1.5}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

      {/* Ornamentos */}
      {config.ornament && createCornerOrnaments()}

      {/* Partículas flutuantes */}
      {createParticles()}

      {/* Efeito de brilho */}
      <pointLight
        ref={glowRef}
        position={[0, 0, 1]}
        intensity={hovered ? 0.5 : 0}
        color={config.glowColor}
        distance={3}
        decay={2}
      />

      {/* Placa de identificação */}
      <mesh position={[0, -config.height / 2 - 0.15, config.depth / 2 + 0.01]}>
        <boxGeometry args={[config.width * 0.7, 0.1, 0.05]} />
        <meshStandardMaterial
          color={config.frameColor}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Informações em HTML (para melhor legibilidade) */}
      <Html
        position={[0, -config.height / 2 - 0.15, config.depth / 2 + 0.02]}
        center
        distanceFactor={15}
        className="pointer-events-none"
      >
        <div className={`text-center transition-all duration-300 ${
          hovered ? 'scale-110' : 'scale-100'
        }`}>
          <p className="text-white text-xs font-bold bg-black/70 backdrop-blur-sm 
                       px-3 py-1 rounded-full whitespace-nowrap">
            {photo.title}
          </p>
          {hovered && (
            <p className="text-white/80 text-xs mt-1 bg-black/50 px-2 py-0.5 rounded">
              {photo.date}
            </p>
          )}
        </div>
      </Html>

      {/* Ícone de interação */}
      <Html
        position={[0, config.height / 2 + 0.25, config.depth / 2 + 0.02]}
        center
        distanceFactor={20}
        className={`transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] 
                        to-[var(--color-accent)] rounded-full flex items-center 
                        justify-center animate-pulse">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" 
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <p className="text-white text-xs bg-black/50 px-2 py-1 rounded-full">
            Ver detalhes
          </p>
        </div>
      </Html>

      {/* Efeito de seleção */}
      {isActive && (
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[config.width * 0.6, config.width * 0.65, 32]} />
          <meshBasicMaterial
            color={config.glowColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Sombras sutis */}
      <mesh 
        position={[0, -config.height / 2 - 0.05, config.depth / 2 - 0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[config.width * 1.1, 0.2]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Efeito de reflexo (opcional) */}
      {hovered && (
        <mesh 
          position={[0, -config.height - 0.3, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[config.width * 0.8, config.height * 0.3]} />
          <meshBasicMaterial
            color={config.glowColor}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Componente auxiliar para Frame de Vídeo
export function VideoFrame({ videoUrl, ...props }) {
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = videoUrl;
    vid.crossOrigin = "anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.play();
    return vid;
  });

  useEffect(() => {
    return () => {
      video.pause();
    };
  }, [video]);

  return (
    <InteractiveFrame
      {...props}
      photo={{ url: videoUrl, title: 'Vídeo', date: '' }}
      frameType="modern"
    >
      {/* Overlay específico para vídeo */}
      <Html
        position={[0, 0, 0.15]}
        center
        distanceFactor={10}
      >
        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </Html>
    </InteractiveFrame>
  );
}

// Componente auxiliar para Frame de Texto/Lembrança
export function MemoryFrame({ memory, ...props }) {
  return (
    <InteractiveFrame
      {...props}
      photo={{ url: '', title: memory.title, date: memory.date }}
      frameType="romantic"
    >
      <Html
        position={[0, 0, 0.15]}
        center
        distanceFactor={8}
        className="w-full p-4"
      >
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <h3 className="font-cinzel text-white text-lg mb-2">{memory.title}</h3>
          <p className="font-inter text-white/80 text-sm">{memory.content}</p>
          <p className="font-inter text-white/60 text-xs mt-2">{memory.date}</p>
          <div className="flex gap-1 mt-3">
            {memory.tags?.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-[var(--color-primary)]/30 
                         text-white text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Html>
    </InteractiveFrame>
  );
}