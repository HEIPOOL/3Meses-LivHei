import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Float, Text, Stars, Sparkles, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useResponsive } from '../hooks/useResponsive';
import { 
  Menu, X, Home, Search, Settings, Info, 
  Heart, Star, Camera, Users, BarChart,
  Moon, Sun, Globe, Filter, Download,
  Music, Volume2, VolumeX, Play, Pause,
  Sparkles as SparklesIcon
} from 'lucide-react';
import { useFrame } from '@react-three/fiber';

// ============================================
// IMPORTAÇÃO DO PLAYER DE MÚSICA
// ============================================
const MusicPlayerOverlay = lazy(() => import('@/components/MusicPlayerOverlay').then(module => ({
  default: module.MusicPlayerOverlay
})).catch(() => ({
  default: () => (
    <div className="fixed bottom-4 right-4 z-50 p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white shadow-glow animate-pulse">
      🎵 Carregando...
    </div>
  )
})));

// ============================================
// PLAYLIST DA GALERIA (CAMINHOS LOCAIS)
// ============================================
const GALLERY_PLAYLIST = [
  {
    id: 'g1',
    src: '/assets/audio/love-love.mp3',
    title: 'Love-Love',
    artist: 'Gilsons',
    artwork: '',
  },
  {
    id: 'g2',
    src: '/assets/audio/Melo-do-Amor.mp3',
    title: 'Melô do Amor',
    artist: 'Puro Suco',
    artwork: '',
  },
  {
    id: 'g3',
    src: '/assets/audio/Mais-Ninguem.mp3',
    title: 'Mais Ninguém',
    artist: 'Banda do Mar',
    artwork: '',
  },
  {
    id: 'g4',
    src: '/assets/audio/A-Droga-do-Amor.mp3',
    title: 'A Droga do Amor',
    artist: 'Ari',
    artwork: '',
  },
  {
    id: 'g5',
    src: '/assets/audio/mergulhei-olhos.mp3',
    title: 'Mergulhei nos seus Olhos',
    artist: 'Natiruts',
    artwork: '',
  },
  {
    id: 'g6',
    src: '/assets/audio/Lutas-Glorias.mp3',
    title: 'Dias de luta, dias de glória',
    artist: 'Charlie Brown Jr',
    artwork: '',
  },
  {
    id: 'g7',
    src: '/assets/audio/Vem-ca.mp3',
    title: 'Vem Cá',
    artist: 'Pelé MilFlows',
    artwork: '',
  },
  {
    id: 'g8',
    src: '/assets/audio/Te-Amar-Demais.mp3',
    title: 'Te Amar Demais',
    artist: 'Sodré',
    artwork: '',
  },
  {
    id: 'g9',
    src: '/assets/audio/Amanda-VulgoFK.mp3',
    title: 'Amanda',
    artist: 'Vulgo FK',
    artwork: '',
  },
  {
    id: 'g10',
    src: '/assets/audio/Mandona.mp3',
    title: 'Mandona (Se eu te dissesse)',
    artist: 'Vulgo FK',
    artwork: '',
  },
  {
    id: 'g11',
    src: '/assets/audio/Ate-final.mp3',
    title: 'Até o Final',
    artist: 'Caio Luccas',
    artwork: '',
  },
  {
    id: 'g12',
    src: '/assets/audio/Louis-V.mp3',
    title: 'Louis V, Menina Linda',
    artist: 'Sidoka',
    artwork: '',
  },
  {
    id: 'g13',
    src: '/assets/audio/Procuro-Alguem.mp3',
    title: 'Procuro Alguém',
    artist: 'Djonga',
    artwork: '',
  },
  {
    id: 'g14',
    src: '/assets/audio/Te-Amo-Disgraca.mp3',
    title: 'Te Amo Disgraça',
    artist: 'Baco Exu do Blues',
    artwork: '',
  },
  {
    id: 'g15',
    src: '/assets/audio/Planos.mp3',
    title: 'Planos',
    artist: 'BK',
    artwork: '',
  },
  {
    id: 'g16',
    src: '/assets/audio/Amanhecer.mp3',
    title: 'Amanhecer',
    artist: 'BK',
    artwork: '',
  },
];

// ============================================
// COMPONENTE DE PARTÍCULAS BRILHANTES
// ============================================
const ShinyParticles = ({ count = 200, color = '#FFD700' }) => {
  const pointsRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 30;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      size[i] = Math.random() * 0.5 + 0.1;
    }
    return size;
  }, [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ============================================
// COMPONENTE GOLDEN SPARKLES (ADICIONE ESTE CÓDIGO)
// ============================================
const GoldenSparkles = ({ 
  count = 100, 
  color = '#FFD700', 
  roomHeight = 10, 
  enabled = true, 
  size = 0.2 
}) => {
  const pointsRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 30;
      pos[i + 1] = (Math.random() - 0.5) * roomHeight;
      pos[i + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count, roomHeight]);

  const sizes = useMemo(() => {
    const sizeArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizeArray[i] = Math.random() * 0.5 + size;
    }
    return sizeArray;
  }, [count, size]);

  useFrame((state) => {
    if (pointsRef.current && enabled) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  if (!enabled) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ============================================
// COMPONENTE DE QUADRO ULTRA BRILHANTE
// ============================================


const BrilliantPhotoFrame = ({ photo, position, rotation, onClick }) => {
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const frameGroupRef = useRef();
  const glowRef = useRef();

  // Tamanhos ajustados
  const FRAME_WIDTH = 1.6;
  const FRAME_HEIGHT = 2.1;
  const FRAME_THICKNESS = 0.15;
  const IMAGE_WIDTH = 1.5;
  const IMAGE_HEIGHT = 2.0;
  const IMAGE_OFFSET = FRAME_THICKNESS / 2 + 0.005;

  // UseFrame para fazer billboarding (sempre de frente para a câmera)
  useFrame((state) => {
    if (!frameGroupRef.current) return;
    
    // Quando NÃO está em hover, faz billboarding (sempre de frente para câmera)
    if (!hovered) {
      // Obtém a posição da câmera
      const cameraPosition = state.camera.position;
      
      // Obtém a posição atual do quadro
      const framePosition = frameGroupRef.current.position;
      
      // Calcula a direção da câmera para o quadro
      const lookAtVector = new THREE.Vector3();
      lookAtVector.subVectors(cameraPosition, framePosition);
      
      // Calcula a rotação necessária para ficar de frente para a câmera
      const targetRotation = Math.atan2(lookAtVector.x, lookAtVector.z);
      
      // Aplica a rotação suavemente
      frameGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        frameGroupRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
  });

  // Efeito de rotação suave apenas quando em hover
  useEffect(() => {
    if (!frameGroupRef.current || !hovered) return;
    
    let frameId;
    let rotationSpeed = 0.005;
    
    const animate = () => {
      if (frameGroupRef.current && hovered) {
        // Rotaciona apenas no eixo Y
        frameGroupRef.current.rotation.y += rotationSpeed;
      }
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [hovered]);

  // Efeito para carregar a textura (mantido igual)
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let isMounted = true;
    let currentTexture = null;

    const loadImage = () => {
      setLoading(true);
      setError(false);

      const url = `${photo.url}?t=${Date.now()}&cache=${photo.id}`;
      
      loader.crossOrigin = 'anonymous';
      
      loader.load(
        url,
        (loadedTexture) => {
          if (!isMounted) return;
          
          loadedTexture.minFilter = THREE.LinearFilter;
          loadedTexture.magFilter = THREE.LinearFilter;
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          loadedTexture.anisotropy = 16;
          loadedTexture.needsUpdate = true;
          
          loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          loadedTexture.repeat.set(1, 1);
          loadedTexture.offset.set(0, 0);

          setTexture(loadedTexture);
          setLoading(false);
          currentTexture = loadedTexture;
        },
        undefined,
        (err) => {
          if (!isMounted) return;
          console.error('Erro ao carregar imagem:', photo.title, err);
          setError(true);
          setLoading(false);
          createFallbackTexture();
        }
      );
    };

    const createFallbackTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Gradiente radial super brilhante
      const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
      
      if (photo.room.includes('Amor')) {
        gradient.addColorStop(0, '#FF6B8B');
        gradient.addColorStop(0.5, '#FF1493');
        gradient.addColorStop(1, '#8B0000');
      } else if (photo.room.includes('Golden')) {
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#D4AF37');
      } else if (photo.room.includes('Sorrisos')) {
        gradient.addColorStop(0, '#FFEAA7');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
      } else {
        gradient.addColorStop(0, '#D4AF37');
        gradient.addColorStop(0.5, '#B8860B');
        gradient.addColorStop(1, '#2A2A2A');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Brilho central
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(512, 512, 200, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 180px Arial';
      ctx.textAlign = 'center';
      
      let icon = '❤️';
      if (photo.room.includes('Sorrisos')) icon = '😊';
      if (photo.room.includes('Momentos')) icon = '📸';
      if (photo.room.includes('Golden')) icon = '🌟';
      
      ctx.fillText(icon, 512, 420);
      
      // Título com sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 20;
      ctx.font = 'bold 64px Arial';
      ctx.fillText(photo.title.substring(0, 20), 512, 680);
      ctx.shadowBlur = 0;
      
      // ID
      ctx.font = '40px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(`Memória #${photo.id}`, 512, 780);
      
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      fallbackTexture.needsUpdate = true;
      
      if (isMounted) {
        setTexture(fallbackTexture);
        currentTexture = fallbackTexture;
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (currentTexture) {
        currentTexture.dispose();
      }
    };
  }, [photo]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(photo);
    }
  }, [photo, onClick]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    if (frameGroupRef.current) {
      frameGroupRef.current.scale.set(1.1, 1.1, 1.1);
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    if (frameGroupRef.current) {
      frameGroupRef.current.scale.set(1, 1, 1);
    }
  }, []);

  const frameColor = useMemo(() => {
    if (photo.room.includes('Amor')) return '#FF1493';
    if (photo.room.includes('Golden')) return '#FFD700';
    if (photo.room.includes('Sorrisos')) return '#FFEAA7';
    return '#D4AF37';
  }, [photo.room]);

  return (
    <group position={position}>
      {/* Glow ao redor do quadro */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          distance={3}
          intensity={2}
          color={frameColor}
          decay={2}
        />
      )}
      
      {/* Efeito de brilho */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <circleGeometry args={[1.1, 32]} />
        <meshBasicMaterial
          color={frameColor}
          transparent
          opacity={hovered ? 0.3 : 0}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* GRUPO PRINCIPAL com billboarding */}
      <group
        ref={frameGroupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Moldura */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT, FRAME_THICKNESS]} />
          <meshPhysicalMaterial
            color={hovered ? '#FFFFFF' : frameColor}
            metalness={hovered ? 0.9 : 0.7}
            roughness={hovered ? 0.1 : 0.3}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive={hovered ? frameColor : '#000000'}
            emissiveIntensity={hovered ? 0.8 : 0}
            transmission={0.1}
            thickness={0.5}
            envMapIntensity={2}
          />
        </mesh>

        {/* Imagem COLADA na moldura - COM DOUBLE SIDE */}
        <mesh position={[0, 0, IMAGE_OFFSET]}>
          <planeGeometry args={[IMAGE_WIDTH, IMAGE_HEIGHT]} />
          {texture && !error ? (
            <meshBasicMaterial 
              map={texture} 
              toneMapped={false}
              transparent={loading}
              opacity={loading ? 0.5 : 1}
              side={THREE.DoubleSide} // IMPORTANTE: renderiza dos dois lados
            />
          ) : (
            <meshBasicMaterial 
              color="#FF1493"
              transparent={true}
              opacity={0.9}
              side={THREE.DoubleSide} // IMPORTANTE: renderiza dos dois lados
            />
          )}
        </mesh>
      </group>

      {/* Partículas ao redor do quadro */}
      {hovered && (
        <Sparkles
          count={20}
          scale={[FRAME_WIDTH + 0.2, FRAME_HEIGHT + 0.2, 0.2]}
          size={0.1}
          speed={0.2}
          color={frameColor}
          opacity={0.8}
          position={[0, 0, IMAGE_OFFSET + 0.05]}
        />
      )}

      <Html position={[0, -FRAME_HEIGHT/2 - 0.15, 0]} center>
        <div 
          className={`transition-all duration-500 ${hovered ? 'opacity-100 scale-110' : 'opacity-80'} cursor-pointer`}
          onClick={handleClick}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
        >
          <div className={`bg-gradient-to-r ${hovered ? 'from-pink-600/90 to-rose-600/90' : 'from-black/90 to-gray-900/90'} backdrop-blur-xl px-4 py-2 rounded-2xl border ${hovered ? 'border-pink-500/50' : 'border-white/20'} shadow-2xl`}>
            <p className="text-white text-sm font-bold whitespace-nowrap tracking-wide">
              {photo.title}
            </p>
            {loading && (
              <div className="w-full h-1 bg-gray-700 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse rounded-full"></div>
              </div>
            )}
            {hovered && (
              <div className="flex items-center justify-center mt-1">
                <SparklesIcon className="w-3 h-3 text-yellow-400 animate-pulse" />
                <span className="text-xs text-yellow-300 ml-1">Clique para ver</span>
                <SparklesIcon className="w-3 h-3 text-yellow-400 animate-pulse ml-1" />
              </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

// ============================================
// COMPONENTE DE SALA ULTRA BRILHANTE
// ============================================
const BrilliantRoom = ({ roomName, photosCount }) => {
  const roomColor = useMemo(() => {
    const colors = {
      'Sala do Amor': '#FF1493',
      'Sala dos Momentos': '#9D00FF',
      'Sala dos Sorrisos': '#FFD700',
      'Sala Vermelha': '#FF0000',
      'Sala Golden Hour': '#FFA500'
    };
    return colors[roomName] || '#FF1493';
  }, [roomName]);

  return (
    <>
      {/* Chão reflexivo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshPhysicalMaterial 
          color={roomColor} 
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.95}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
          reflectivity={0.8}
        />
      </mesh>

      {/* Efeito de neblina no chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshBasicMaterial
          color={roomColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.6}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
          strokeWidth={0.02}
          strokeColor={roomColor}
        >
          {roomName}
        </Text>
      </Float>
    </>
  );
};

// ============================================
// CENA PRINCIPAL SUPER BRILHANTE
// ============================================
const BrilliantGalleryScene = ({ photos, currentRoom, onPhotoClick }) => {
  const roomPhotos = useMemo(() => 
    photos.filter(photo => photo.room === currentRoom), 
    [photos, currentRoom]
  );

  const roomSparkleColor = useMemo(() => {
    const colors = {
      'Sala do Amor': '#FF1493',
      'Sala Golden Hour': '#FFD700',
      'Sala dos Sorrisos': '#FFEAA7',
      'Sala Vermelha': '#FF0000',
      'Sala dos Momentos': '#9D00FF'
    };
    return colors[currentRoom] || '#FFD700';
  }, [currentRoom]);

  const ambientColor = useMemo(() => {
    const colors = {
      'Sala do Amor': '#FF6B8B',
      'Sala Golden Hour': '#FFA500',
      'Sala dos Sorrisos': '#FFD700',
      'Sala Vermelha': '#8B0000',
      'Sala dos Momentos': '#55045b'
    };
    return colors[currentRoom] || '#FF6B8B';
  }, [currentRoom]);

  return (
    <>
      {/* Estrelas de fundo */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Partículas brilhantes */}
      <ShinyParticles count={300} color={roomSparkleColor} />
      
      <ambientLight intensity={1.2} color={ambientColor} />
      
      {/* Luzes direcionais coloridas */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#FF6B8B"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      
      <directionalLight
        position={[-10, 10, -5]}
        intensity={1}
        color="#9D00FF"
        castShadow
      />
      
      {/* Luzes pontuais móveis */}
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#FF1493" distance={20} decay={2} />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#00D4FF" distance={20} decay={2} />
      <pointLight position={[0, 8, 0]} intensity={2} color={roomSparkleColor} distance={25} decay={1.5} />
      
      {/* Luz rotativa */}
      <Float speed={2} rotationIntensity={2}>
        <pointLight position={[0, 3, 0]} intensity={1.2} color="#FFD700" distance={15} decay={2} />
      </Float>
      
      <BrilliantRoom roomName={currentRoom} photosCount={roomPhotos.length} />
      
      <GoldenSparkles 
        key={currentRoom}
        count={currentRoom.includes('Golden') ? 150 : 100}
        color={roomSparkleColor}
        roomHeight={10}
        enabled={true}
        size={currentRoom.includes('Golden') ? 0.3 : 0.2}
      />
      
      {/* Partículas extras */}
      <Sparkles
        count={100}
        scale={[25, 10, 25]}
        size={0.1}
        speed={0.3}
        color={roomSparkleColor}
        opacity={0.6}
      />
      
      {roomPhotos.map((photo, index) => {
        const angle = (index / roomPhotos.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(Date.now() * 0.001 + index) * 0.3;
        
        return (
          <Float
            key={`${photo.id}-${currentRoom}-${index}`}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <BrilliantPhotoFrame
              photo={photo}
              position={[x, 1.5 + y, z]}
              rotation={[0, -angle + Math.PI, 0]}
              onClick={onPhotoClick}
            />
          </Float>
        );
      })}
      
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.05}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// ============================================
// TELA DE CARREGAMENTO ULTRA BRILHANTE
// ============================================
const ShinyLoadingScreen = () => (
  <div className="absolute inset-0 z-50 bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
    <div className="relative text-center">
      {/* Anel giratório brilhante */}
      <div className="relative mb-12">
        <div className="absolute inset-0 animate-spin">
          <div className="w-32 h-32 border-[6px] border-transparent border-t-pink-500 rounded-full"></div>
          <div className="w-28 h-28 border-[5px] border-transparent border-b-purple-500 rounded-full absolute top-2 left-2"></div>
          <div className="w-24 h-24 border-[4px] border-transparent border-l-yellow-500 rounded-full absolute top-4 left-4"></div>
        </div>
        
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-pink-500/50">
          <span className="text-4xl animate-pulse">💖</span>
        </div>
        
        {/* Partículas ao redor */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-1000"></div>
      </div>
      
      <h1 className="font-cinzel text-4xl md:text-5xl text-white mb-4 bg-gradient-to-r from-pink-300 via-white to-yellow-300 bg-clip-text text-transparent">
        Preparando sua galeria
      </h1>
      <p className="text-gray-300 text-lg animate-pulse flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
        Carregando memórias especiais...
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></span>
      </p>
      
      {/* Efeito de brilho no fundo */}
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  </div>
);

// ============================================
// DADOS DAS FOTOS DA GALERIA
// ============================================
const GALLERY_PHOTOS = [
  {
    id: 1,
    url: 'https://i.ibb.co/JW5phYyr/IMG-20251203-WA0106.jpg',
    title: 'Profundidade',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'O dia em que nossas histórias se encontraram',
    tags: ['amor', 'primeiros momentos', 'especial'],
    room: 'Sala do Amor'
  },
  {
    id: 2,
    url: 'https://i.ibb.co/nsy7MJwH/IMG-20251203-WA0105.jpg',
    title: 'Sorrisos Compartilhados',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Rindo juntos como sempre',
    tags: ['sorrisos', 'alegria'],
    room: 'Sala dos Sorrisos'
  },
  {
    id: 3,
    url: 'https://i.ibb.co/7t2N2JN6/IMG-20251203-WA0104.jpg',
    title: 'Momento Especial',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Um instante perfeito capturado',
    tags: ['momento', 'especial'],
    room: 'Sala dos Momentos'
  },
  {
    id: 4,
    url: 'https://i.ibb.co/MDJtmqs1/IMG-20251203-WA0101.jpg',
    title: 'Olhares que Falam',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Quando nossos olhos se encontraram',
    tags: ['olhares', 'conexão'],
    room: 'Sala do Amor'
  },
  {
    id: 5,
    url: 'https://i.ibb.co/8nSFMcbZ/IMG-20251203-WA0102.jpg',
    title: 'Aconchego',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'O conforto do seu abraço',
    tags: ['aconchego', 'carinho'],
    room: 'Sala Vermelha'
  },
  {
    id: 6,
    url: 'https://i.ibb.co/S7PWYknC/IMG-20251203-WA0100.jpg',
    title: 'Pensativos',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Pensando no nosso futuro',
    tags: ['pensativo', 'futuro'],
    room: 'Sala dos Momentos'
  },
  {
    id: 7,
    url: 'https://i.ibb.co/ksbq23gb/IMG-20251203-WA0110.jpg',
    title: 'Risadas',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'A alegria que você me traz',
    tags: ['risadas', 'alegria'],
    room: 'Sala dos Sorrisos'
  },
  {
    id: 8,
    url: 'https://i.ibb.co/JjMgQkZG/IMG-20251203-WA0109.jpg',
    title: 'Conexão',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Almas gêmeas conectadas',
    tags: ['conexão', 'alma gêmea'],
    room: 'Sala do Amor'
  },
  {
    id: 9,
    url: 'https://i.ibb.co/MK38j3N/IMG-20251203-WA0108.jpg',
    title: 'Segredo',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Segredos sussurrados',
    tags: ['segredo', 'intimidade'],
    room: 'Sala Vermelha'
  },
  {
    id: 10,
    url: 'https://i.ibb.co/7tkjwXzx/IMG-20251203-WA0107.jpg',
    title: 'Parceria',
    date: '2025-12-03',
    location: 'Picos, PI',
    description: 'Juntos em tudo',
    tags: ['parceria', 'juntos'],
    room: 'Sala dos Momentos'
  },
  {
    id: 11,
    url: 'https://i.ibb.co/TxGppMJW/IMG-20251102-WA0360.jpg',
    title: 'Aventura',
    date: '2025-11-02',
    location: 'Picos, PI',
    description: 'Explorando o mundo juntos',
    tags: ['aventura', 'exploração'],
    room: 'Sala Golden Hour'
  },
  {
    id: 12,
    url: 'https://i.ibb.co/kgzx7s0h/IMG-20251102-WA0363.jpg',
    title: 'Doçura',
    date: '2025-11-02',
    location: 'Picos, PI',
    description: 'A doçura do seu sorriso',
    tags: ['doçura', 'sorriso'],
    room: 'Sala dos Sorrisos'
  },
  {
    id: 13,
    url: 'https://i.ibb.co/jvDhPG3j/IMG-20251102-WA0364.jpg',
    title: 'Nosso Primeiro Encontro',
    date: '2025-11-02',
    location: 'Picos, PI',
    description: 'Olhares profundos',
    tags: ['profundidade', 'olhares'],
    room: 'Sala do Amor'
  },
  {
    id: 14,
    url: 'https://i.ibb.co/Jw6RdNb0/IMG-20251102-WA0368.jpg',
    title: 'Complicidade',
    date: '2025-11-02',
    location: 'Picos, PI',
    description: 'Risadas compartilhadas',
    tags: ['complicidade', 'risadas'],
    room: 'Sala dos Sorrisos'
  },
  {
    id: 15,
    url: 'https://i.ibb.co/TMpBRVxq/IMG-20251102-WA0369.jpg',
    title: 'Eternidade',
    date: '2025-11-02',
    location: 'Picos, PI',
    description: 'Promessas para sempre',
    tags: ['eternidade', 'promessas'],
    room: 'Sala Golden Hour'
  },
  {
    id: 16,
    url: 'https://i.ibb.co/8DRjGscc/IMG-20251225-WA0013.jpg',
    title: 'Detalhes Eternos',
    date: '2025-12-24',
    location: 'Picos, PI',
    description: 'Pequenos detalhes, grande significado',
    tags: ['detalhes', 'eternidade'],
    room: 'Sala dos Momentos'
  },
  {
    id: 17,
    url: 'https://i.ibb.co/KcZkXf70/IMG-20251225-WA0015.jpg',
    title: 'Compromisso',
    date: '2025-12-24',
    location: 'Picos, PI',
    description: 'Escolha feita de coração',
    tags: ['compromisso', 'alianças'],
    room: 'Sala dos Momentos'
  },
  {
    id: 18,
    url: 'https://i.ibb.co/Q731xXyV/IMG-20251225-WA0016.jpg',
    title: 'Para Sempre',
    date: '2025-12-24',
    location: 'Picos, PI',
    description: 'Um começo com cara de eternidade',
    tags: ['para sempre', 'amor'],
    room: 'Sala dos Momentos'
  },
  {
    id: 19,
    url: 'https://i.ibb.co/wZMW7zXJ/IMG-20251225-WA0017.jpg',
    title: 'Aliança em Foco',
    date: '2025-12-24',
    location: 'Picos, PI',
    description: 'O detalhe que diz tudo',
    tags: ['aliança', 'significado'],
    room: 'Sala dos Momentos'
  },
  {
    id: 20,
    url: 'https://i.ibb.co/5Q70gqz/IMG-20251225-WA0018.jpg',
    title: 'Nosso Compromisso',
    date: '2025-12-24',
    location: 'Picos, PI',
    description: 'Firmado no amor e na verdade',
    tags: ['compromisso', 'união'],
    room: 'Sala dos Momentos'
  }
];

// ============================================
// COMPONENTE DE MODAL DE FOTO SUPER BRILHANTE
// ============================================
const ShinyPhotoModal = ({ photo, onClose }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
      onClick={handleOverlayClick}
    >
      {/* Efeito de brilho no fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.8, y: 40, rotateX: 10 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, y: 40, rotateX: 10 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative max-w-5xl w-full max-h-[90vh] bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Container da imagem com reflexo */}
        <div className="relative h-72 md:h-[500px] overflow-hidden">
          {!imgError ? (
            <>
              <img
                src={`${photo.url}?t=${Date.now()}`}
                alt={photo.title}
                className="w-full h-full object-cover scale-105"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  console.log('❌ Imagem falhou no modal');
                  setImgError(true);
                }}
                style={{ 
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
                  transform: imgLoaded ? 'scale(1.05)' : 'scale(1)'
                }}
              />
              
              {!imgLoaded && !imgError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-rose-500/20">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-6"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="text-2xl text-white animate-pulse">📸</span>
                      </div>
                    </div>
                    <p className="text-white text-lg font-semibold">Carregando memória especial...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-rose-500/30 p-12">
              <div className="text-8xl mb-8 animate-pulse">
                {photo.room.includes('Amor') ? '💖' : 
                 photo.room.includes('Golden') ? '🌟' : 
                 photo.room.includes('Sorrisos') ? '😊' : '📷'}
              </div>
              <h3 className="text-white text-4xl font-cinzel mb-6 text-center bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">{photo.title}</h3>
              <p className="text-gray-200 text-center text-xl max-w-lg">{photo.description}</p>
              <div className="mt-8 px-6 py-3 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
                <p className="text-white/90 text-sm">Memória #{photo.id} • {photo.room}</p>
              </div>
            </div>
          )}
          
          {/* Gradiente brilhante sobre a imagem */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-500/10 to-transparent" />
        </div>
        
        {/* Informações com design melhorado */}
        <div className="p-8 md:p-10 overflow-y-auto max-h-[40vh]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-cinzel text-3xl md:text-4xl text-white mb-3 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">{photo.title}</h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm rounded-full font-semibold">
                  {photo.room}
                </span>
                <span className="text-gray-300 text-sm">• {photo.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-full">
                📍 {photo.location}
              </span>
            </div>
          </div>
          
          <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed">{photo.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-xl p-4 border border-pink-500/30 backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-1">Data Especial</p>
              <p className="text-white font-bold text-lg">{photo.date}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-1">Local</p>
              <p className="text-white font-bold text-lg">{photo.location}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30 backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-1">ID da Memória</p>
              <p className="text-white font-bold text-lg">#{photo.id}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30 backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-1">Tags</p>
              <p className="text-white font-bold text-lg">{photo.tags.length}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {photo.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-gradient-to-r from-pink-900/40 to-rose-900/40 text-pink-200 rounded-full text-sm border border-pink-500/30 backdrop-blur-sm hover:from-pink-700/60 hover:to-rose-700/60 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-rose-900/30 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center">
                <span className="text-lg">
                  {photo.room.includes('Amor') && '💖'}
                  {photo.room.includes('Golden') && '🌟'}
                  {photo.room.includes('Sorrisos') && '😊'}
                  {photo.room.includes('Momentos') && '📸'}
                </span>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Sala Especial</p>
                <p className="text-white font-bold text-xl">{photo.room}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-2">Esta memória está guardada em uma sala temática especial da galeria.</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full flex items-center justify-center hover:from-pink-700 hover:to-rose-700 transition-all duration-300 z-10 shadow-2xl hover:shadow-pink-500/50 hover:scale-110"
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Efeitos decorativos */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-500 rounded-full blur-md opacity-70"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-500 rounded-full blur-md opacity-70"></div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// COMPONENTE HAMBURGER MENU
// ============================================
// Componente Hamburger Menu
const HamburgerMenu = ({ 
  isOpen, 
  onClose, 
  rooms, 
  currentRoom, 
  onRoomChange,
  roomPhotos,
  totalPhotos
}) => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [musicVolume, setMusicVolume] = useState(70);
  
  const menuRef = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  const filteredPhotos = useMemo(() => {
    if (!searchQuery) return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter(photo => 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);
  
  const stats = useMemo(() => {
    const roomStats = rooms.reduce((acc, room) => {
      acc[room] = GALLERY_PHOTOS.filter(p => p.room === room).length;
      return acc;
    }, {});
    
    const totalTags = GALLERY_PHOTOS.flatMap(p => p.tags);
    const uniqueTags = [...new Set(totalTags)];
    
    return {
      totalPhotos: GALLERY_PHOTOS.length,
      rooms: rooms.length,
      tags: uniqueTags.length,
      roomStats,
      mostCommonTag: totalTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {})
    };
  }, [rooms]);

  const tabs = [
    { id: 'rooms', label: 'Salas', icon: '🏠' },
    { id: 'photos', label: 'Fotos', icon: '📸' },
    { id: 'stats', label: 'Estatísticas', icon: '📊' },
    { id: 'music', label: 'Música', icon: '🎵' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            ref={menuRef}
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 md:w-96 z-50"
          >
            <div className="h-full bg-gradient-to-b from-gray-900 to-black border-r border-white/10 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-pink-900/20 to-rose-900/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-cinzel text-2xl text-white">
                    <span className="text-pink-500">☰</span> Galeria
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Fechar menu"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar fotos, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-pink-500 border-b-2 border-pink-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="h-[calc(100%-180px)] overflow-y-auto">
                {activeTab === 'rooms' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🏠 Salas da Galeria</h3>
                    <div className="space-y-3">
                      {rooms.map((room) => {
                        const count = stats.roomStats[room] || 0;
                        return (
                          <button
                            key={room}
                            onClick={() => {
                              onRoomChange(room);
                              onClose();
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                              currentRoom === room
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                currentRoom === room ? 'bg-white/20' : 'bg-pink-500/10'
                              }`}>
                                <span className="text-lg">
                                  {room.includes('Amor') && '❤️'}
                                  {room.includes('Momentos') && '📸'}
                                  {room.includes('Sorrisos') && '😊'}
                                  {room.includes('Vermelha') && '🔴'}
                                  {room.includes('Golden') && '🌟'}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{room}</p>
                                <p className="text-sm opacity-75">{count} foto{count !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            {currentRoom === room && (
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {activeTab === 'photos' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">📸 Todas as Fotos</h3>
                      <span className="text-sm text-gray-400">{filteredPhotos.length} itens</span>
                    </div>
                    
                    <div className="space-y-3">
                      {filteredPhotos.slice(0, 10).map((photo) => (
                        <div
                          key={photo.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            onRoomChange(photo.room);
                            onClose();
                          }}
                        >
                          <div className="w-12 h-12 rounded overflow-hidden bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                            {photo.url ? (
                              <img
                                src={`${photo.url}?w=100&h=100`}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Camera className="w-6 h-6 text-pink-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{photo.title}</p>
                            <p className="text-sm text-gray-400 truncate">{photo.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full">
                                {photo.room}
                              </span>
                              <span className="text-xs text-gray-500">{photo.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredPhotos.length > 10 && (
                        <div className="text-center pt-2">
                          <button className="text-sm text-pink-400 hover:text-pink-300 transition-colors">
                            Ver mais {filteredPhotos.length - 10} fotos...
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-white font-medium mb-3">🏷️ Tags Populares</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.mostCommonTag)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 8)
                          .map(([tag, count]) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gradient-to-r from-pink-900/30 to-rose-900/30 text-pink-300 rounded-full text-sm border border-pink-500/20"
                            >
                              #{tag} <span className="text-xs opacity-75">({count})</span>
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'stats' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">📊 Estatísticas da Galeria</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
                        <div className="text-3xl font-bold text-pink-500 mb-2">{stats.totalPhotos}</div>
                        <p className="text-gray-300 text-sm">Fotos no total</p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
                        <div className="text-3xl font-bold text-pink-500 mb-2">{stats.rooms}</div>
                        <p className="text-gray-300 text-sm">Salas diferentes</p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
                        <div className="text-3xl font-bold text-pink-500 mb-2">{stats.tags}</div>
                        <p className="text-gray-300 text-sm">Tags únicas</p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
                        <div className="text-3xl font-bold text-pink-500 mb-2">{roomPhotos.length}</div>
                        <p className="text-gray-300 text-sm">Nesta sala</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-white font-medium mb-4">📈 Distribuição por Sala</h4>
                      <div className="space-y-3">
                        {rooms.map((room) => {
                          const count = stats.roomStats[room] || 0;
                          const percentage = (count / stats.totalPhotos) * 100;
                          
                          return (
                            <div key={room} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">{room}</span>
                                <span className="text-pink-400">{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 rounded-xl p-4 border border-pink-500/20">
                      <h4 className="text-white font-medium mb-3">🔧 Informações Técnicas</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plataforma:</span>
                          <span className="text-white">Next.js + Three.js</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Renderização:</span>
                          <span className="text-white">3D WebGL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Memórias:</span>
                          <span className="text-white">20+ momentos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Música:</span>
                          <span className="text-white">3 faixas ambient</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'music' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">🎵 Trilha Sonora</h3>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 rounded-xl p-4 border border-pink-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">Trilha da Galeria</p>
                              <p className="text-sm text-gray-400">3 faixas ambient</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                              <Play className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                              <Pause className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {GALLERY_PLAYLIST.map((track, index) => (
                            <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg bg-black/30">
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <img
                                  src={track.artwork}
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{track.title}</p>
                                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                              </div>
                              <div className="text-xs text-pink-400 px-2 py-1 bg-pink-500/10 rounded">
                                {index === 0 ? 'Tocando' : `${index + 1}:${index + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">Volume da Música</span>
                            <span className="text-pink-400">{musicVolume}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 [&::-webkit-slider-thumb]:to-rose-500"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                            <Volume2 className="w-4 h-4" />
                            Ativar Som
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                            <VolumeX className="w-4 h-4" />
                            Silenciar
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 pt-4 border-t border-white/10">
                        <p className="mb-2">🎹 Controles de Teclado:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-xs">Espaço</span>
                            <span>Play/Pause</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-xs">← →</span>
                            <span>Av./Vol. 10s</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-xs">Shift+P</span>
                            <span>Anterior</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-xs">Shift+N</span>
                            <span>Próxima</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">⚙️ Configurações</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          {darkMode ? (
                            <Moon className="w-5 h-5 text-pink-500" />
                          ) : (
                            <Sun className="w-5 h-5 text-yellow-500" />
                          )}
                          <div>
                            <p className="text-white font-medium">Modo {darkMode ? 'Escuro' : 'Claro'}</p>
                            <p className="text-sm text-gray-400">Alternar tema da interface</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            darkMode ? 'bg-pink-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">Qualidade Gráfica</p>
                          <span className="text-sm text-pink-400">Alta</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">Ajuste a qualidade do 3D</p>
                        <div className="flex gap-2">
                          {['Baixa', 'Média', 'Alta'].map((quality) => (
                            <button
                              key={quality}
                              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                                quality === 'Alta'
                                  ? 'bg-pink-600 text-white'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5">
                        <h4 className="text-white font-medium mb-3">🎮 Controles 3D</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Sensibilidade do mouse</span>
                            <span className="text-pink-400">Média</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Zoom automático</span>
                            <div className="w-4 h-4 bg-pink-500 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Rotação contínua</span>
                            <div className="w-4 h-4 border-2 border-pink-500 rounded" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <button className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                          <Download className="w-4 h-4" />
                          Exportar
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                          <Globe className="w-4 h-4" />
                          Compartilhar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-white/10 bg-gradient-to-r from-pink-900/10 to-rose-900/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-white">Heitor & Livia</p>
                    <p className="text-gray-400 text-xs">Galeria do Amor</p>
                  </div>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    <Home className="w-4 h-4" />
                    Início
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// ============================================
// COMPONENTE PRINCIPAL GALLERY PAGE
// ============================================
export default function GalleryPage() {
  const [currentRoom, setCurrentRoom] = useState('Sala do Amor');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(1);

  const responsive = useResponsive();
  const rooms = useMemo(() => ['Sala do Amor', 'Sala dos Momentos', 'Sala dos Sorrisos', 'Sala Vermelha', 'Sala Golden Hour'], []);
  const roomPhotos = useMemo(() => 
    GALLERY_PHOTOS.filter(photo => photo.room === currentRoom),
    [currentRoom]
  );

  // Efeito de intensidade de brilho pulsante
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => Math.sin(Date.now() * 0.002) * 0.2 + 1);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          handleCloseModal();
        }
        if (menuOpen) {
          setMenuOpen(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedPhoto, menuOpen]);

  const handlePhotoClick = useCallback((photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleRoomChange = useCallback((room) => {
    setCurrentRoom(room);
    setMenuOpen(false);
  }, []);

  const handleTrackChange = (trackId) => {
    console.log('🎵 Faixa alterada:', trackId);
  };

  if (isLoading) {
    return <ShinyLoadingScreen />;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 overflow-hidden">
      {/* Efeitos de brilho no fundo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-purple-500/10 via-pink-500/5 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 3, 12], fov: 60 }}
          raycaster={{ params: { Line: { threshold: 0.1 } } }}
          performance={{ min: 0.8 }}
          gl={{ alpha: true, antialias: true }}
        >
          <BrilliantGalleryScene
            photos={GALLERY_PHOTOS}
            currentRoom={currentRoom}
            onPhotoClick={handlePhotoClick}
          />
        </Canvas>
      </div>

      {/* Header super brilhante */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 flex items-center justify-center shadow-2xl shadow-pink-500/50 animate-pulse">
                <span className="text-2xl">💖</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-purple-400 rounded-full animate-ping delay-300"></div>
            </div>
            <div>
              <h1 className="font-cinzel text-2xl md:text-4xl text-white bg-gradient-to-r from-pink-300 via-white to-yellow-300 bg-clip-text text-transparent">
                Heitor & Livia
              </h1>
              <p className="text-gray-300 text-xs md:text-sm mt-1 flex items-center gap-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-full border border-pink-500/30">
                  <SparklesIcon className="w-3 h-3 text-yellow-400" />
                  <span>Galeria Imersiva 3D</span>
                  <Music className="w-3 h-3 text-pink-400" />
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Botão de música brilhante */}
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`p-3 rounded-full transition-all duration-500 ${musicEnabled 
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/70' 
                : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:bg-gray-800/80'
              } border ${musicEnabled ? 'border-pink-500/50' : 'border-white/20'} hover:scale-110 relative overflow-hidden`}
              aria-label={musicEnabled ? "Desativar música" : "Ativar música"}
            >
              {musicEnabled ? (
                <>
                  <Music className="w-5 h-5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </>
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            
            {/* Botão de menu brilhante */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`hamburger-btn p-3.5 rounded-xl transition-all duration-500 ${menuOpen 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                : 'bg-gradient-to-r from-pink-900/40 to-purple-900/40'
              } backdrop-blur-xl border ${menuOpen ? 'border-purple-500/50' : 'border-white/20'} shadow-2xl hover:scale-105 hover:shadow-purple-500/30`}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-pink-900/50 via-purple-900/50 to-rose-900/50 backdrop-blur-xl text-white rounded-xl hover:from-pink-900/70 hover:via-purple-900/70 hover:to-rose-900/70 transition-all duration-500 border border-white/20 shadow-2xl hover:shadow-pink-500/30 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Voltar</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Music Player Overlay */}
      <Suspense fallback={
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 rounded-full animate-pulse shadow-2xl">
          <div className="w-6 h-6"></div>
        </div>
      }>
        {musicEnabled && (
          <MusicPlayerOverlay
            playlist={GALLERY_PLAYLIST}
            autoplay={true}
            startMuted={false}
            volume={0.7}
            persistKey="galeriaHeitorLivia"
            onTrackChange={handleTrackChange}
            className="!z-40 !opacity-100 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-pink-500/30"
          />
        )}
      </Suspense>

            <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        rooms={rooms}
        currentRoom={currentRoom}
        onRoomChange={handleRoomChange}
        roomPhotos={roomPhotos}
        totalPhotos={GALLERY_PHOTOS.length}
      />



      {/* Navegação de salas - Desktop */}
      {!responsive.isMobile && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex gap-2 bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-2xl rounded-2xl p-2 border border-white/20 shadow-2xl">
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => handleRoomChange(room)}
                className={`px-6 py-3 rounded-xl transition-all duration-500 text-sm font-semibold ${
                  currentRoom === room
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 text-white shadow-lg scale-105'
                    : 'bg-gradient-to-r from-white/5 to-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info da sala brilhante */}
      {showRoomInfo && (
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="absolute top-28 left-4 md:left-8 z-30"
        >
          <div className="bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-2xl rounded-2xl p-5 md:p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 flex items-center justify-center shadow-2xl shadow-pink-500/50 animate-pulse">
                  <span className="text-3xl">
                    {currentRoom.includes('Amor') && '💖'}
                    {currentRoom.includes('Momentos') && '📸'}
                    {currentRoom.includes('Sorrisos') && '😊'}
                    {currentRoom.includes('Vermelha') && '🔴'}
                    {currentRoom.includes('Golden') && '🌟'}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-purple-400 rounded-full animate-ping delay-500"></div>
              </div>
              <div>
                <h3 className="font-cinzel text-white text-2xl md:text-3xl bg-gradient-to-r from-pink-300 via-white to-yellow-300 bg-clip-text text-transparent">
                  {currentRoom}
                </h3>
                <p className="text-gray-300 text-base md:text-lg mt-1">
                  <span className="text-pink-400 font-bold">{roomPhotos.length}</span> memória{roomPhotos.length !== 1 ? 's' : ''} especiais
                </p>
                <button 
                  onClick={() => setMenuOpen(true)}
                  className="flex items-center gap-2 text-sm text-pink-300 hover:text-pink-200 transition-colors mt-3 group"
                >
                  <span className="px-3 py-1.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-full border border-pink-500/30 group-hover:border-pink-500/60 transition-colors">
                    Explorar todas as salas
                  </span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Card de instruções super brilhante */}
      <div className="absolute bottom-6 right-4 md:right-8 z-30">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-2xl rounded-2xl p-5 md:p-6 border border-white/20 shadow-2xl max-w-xs"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-sm">🎮</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Como navegar:</p>
              <p className="text-gray-400 text-xs">Dicas para melhor experiência</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 flex-shrink-0 animate-pulse"></div>
              <span>Arraste para olhar ao redor</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0 animate-pulse delay-300"></div>
              <span>Scroll do mouse para zoom</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0 animate-pulse delay-700"></div>
              <span>Clique nas fotos para detalhes</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 animate-pulse delay-1000"></div>
              <span>Menu para opções e música</span>
            </li>
            <li className="flex items-start gap-3 pt-3 border-t border-white/10">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mt-1.5 flex-shrink-0"></div>
              <span className="text-pink-300 font-semibold">Música: Espaço (play/pause)</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <ShinyPhotoModal
            photo={selectedPhoto}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Footer brilhante */}
      <footer className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-2xl px-5 py-3 rounded-full border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2 text-xs">
            <SparklesIcon className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-300">Total:</span>
            <span className="text-white font-bold">{GALLERY_PHOTOS.length} memórias</span>
          </div>
          <div className="w-1 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          <div className="flex items-center gap-2 text-xs">
            <Music className="w-3 h-3 text-pink-400" />
            <span className="text-gray-300">Música:</span>
            <span className={`font-bold ${musicEnabled ? 'text-green-400' : 'text-red-400'}`}>
              {musicEnabled ? 'Ativa 🎶' : 'Desativada'}
            </span>
          </div>
          <div className="w-1 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          <div className="text-xs text-gray-400">
            {new Date().getFullYear()} • Heitor & Livia 💖
          </div>
        </div>
      </footer>

      {/* Efeitos de partículas na UI */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
