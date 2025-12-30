// src/components/3d/GalleryScene.jsx - IMPORT CORRIGIDO
import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import Room from './Room'; // ← Mudado para default import
import CameraController from './CameraController'; // ← Mudado para default import
import InteractiveFrame from './InteractiveFrame';
import GoldenSparkles from './GoldenSparkles'; // ← Importando o componente GoldenSparkles

export default function GalleryScene({ photos, currentRoom, onPhotoClick, viewMode }) {
  const { camera } = useThree();
  const sceneRef = useRef();
  const [roomPhotos, setRoomPhotos] = useState([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  
  // Filtrar fotos por sala
  useEffect(() => {
    const filtered = photos.filter(photo => photo.room === currentRoom);
    setRoomPhotos(filtered);
  }, [currentRoom, photos]);
  
  // Configuração das salas
  const roomConfigs = {
    'Sala do Amor': {
      color: '#8B0000',
      lighting: 'warm',
      particleColor: '#FF6B8B',
      layout: 'circular'
    },
    'Sala dos Momentos': {
      color: '#2A2A2A',
      lighting: 'neutral',
      particleColor: '#D4AF37',
      layout: 'grid'
    },
    'Sala dos Sorrisos': {
      color: '#D4AF37',
      lighting: 'warm',
      particleColor: '#FFD700',
      layout: 'circular'
    },
    'Sala das Memórias': {
      color: '#1A1A1A',
      lighting: 'soft',
      particleColor: '#87CEEB',
      layout: 'grid'
    },
    'Sala Vermelha': {
      color: '#8B0000',
      lighting: 'dramatic',
      particleColor: '#FF0000',
      layout: 'circular'
    },
    'Sala Golden Hour': {
      color: '#D4AF37',
      lighting: 'golden',
      particleColor: '#FFD700',
      layout: 'circular'
    }
  };
  
  const config = roomConfigs[currentRoom] || roomConfigs['Sala do Amor'];
  
  const handlePhotoClick = (photo) => {
    setSelectedPhotoId(photo.id);
    onPhotoClick(photo);
  };

  return (
    <group ref={sceneRef}>
      {/* Ambiente da sala */}
      <Room 
        config={config} 
        roomName={currentRoom}
        photosCount={roomPhotos.length}
      />
      
      {/* Controle de câmera baseado no modo */}
      <CameraController 
        mode={viewMode} 
        targetRoom={currentRoom}
        onCameraMove={(pos, target) => {
          // Callback opcional para rastrear movimento da câmera
        }}
      />
      
      {/* Quadros interativos */}
// No componente BrilliantGalleryScene, dentro do map das roomPhotos:
{roomPhotos.map((photo, index) => {
  const angle = (index / roomPhotos.length) * Math.PI * 2;
  const radius = 6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(Date.now() * 0.001 + index) * 0.3;
  
  // Rotação base para ficar voltado para o centro
  const baseRotation = [0, -angle + Math.PI, 0];
  
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
        rotation={baseRotation}
        onClick={onPhotoClick}
      />
    </Float>
  );
})}
      
      {/* Iluminação dinâmica */}
      <ambientLight intensity={0.4} color={config.lighting === 'warm' ? '#FFEEDD' : '#FFFFFF'} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 3, 0]} intensity={0.3} color={config.particleColor} />

    <GoldenSparkles 
      key={currentRoom} // Força recriação ao trocar de sala
      count={currentRoom.includes('Golden') ? 80 : 40}
      color={config.particleColor}
      roomHeight={6}
      enabled={true}
    />
    </group>
  );
}