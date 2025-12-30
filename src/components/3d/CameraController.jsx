// src/components/3d/CameraController.jsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function CameraController({ 
  mode = 'free', 
  targetRoom,
  targetPosition,
  onCameraMove 
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const targetRef = useRef(new THREE.Vector3());
  const animationRef = useRef({ active: false, progress: 0 });

  // Posições pré-definidas para cada sala
  const roomPositions = {
    'Sala do Amor': { position: [0, 2, 8], target: [0, 1.5, 0] },
    'Sala dos Momentos': { position: [8, 2, 0], target: [0, 1.5, 0] },
    'Sala dos Sorrisos': { position: [0, 2, -8], target: [0, 1.5, 0] },
    'Sala das Memórias': { position: [-8, 2, 0], target: [0, 1.5, 0] },
    'Sala Vermelha': { position: [5.66, 2, 5.66], target: [0, 1.5, 0] },
    'Sala Golden Hour': { position: [-5.66, 2, -5.66], target: [0, 1.5, 0] }
  };

  // Configurações de câmera para cada modo
  const modeConfigs = {
    free: {
      enableZoom: true,
      enablePan: true,
      maxPolarAngle: Math.PI / 2,
      minDistance: 2,
      maxDistance: 15,
      dampingFactor: 0.05
    },
    guided: {
      enableZoom: false,
      enablePan: false,
      maxPolarAngle: Math.PI / 2.5,
      minDistance: 5,
      maxDistance: 10,
      dampingFactor: 0.1
    },
    auto: {
      enableZoom: false,
      enablePan: false,
      maxPolarAngle: Math.PI / 2,
      minDistance: 6,
      maxDistance: 6,
      dampingFactor: 0.2
    }
  };

  const config = modeConfigs[mode] || modeConfigs.free;

  // Animação para transição entre salas
  useEffect(() => {
    if (targetRoom && mode === 'guided') {
      const roomPos = roomPositions[targetRoom];
      if (roomPos) {
        animationRef.current = {
          active: true,
          progress: 0,
          startPosition: camera.position.clone(),
          endPosition: new THREE.Vector3(...roomPos.position),
          startTarget: controlsRef.current?.target.clone() || new THREE.Vector3(0, 1.5, 0),
          endTarget: new THREE.Vector3(...roomPos.target),
          duration: 2.0
        };
      }
    }
  }, [targetRoom, mode]);

  // Animação automática para modo auto
  useEffect(() => {
    if (mode === 'auto') {
      // Configurar posição inicial
      camera.position.set(0, 3, 10);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1.5, 0);
      }
    }
  }, [mode, camera]);

  useFrame((state, delta) => {
    if (controlsRef.current) {
      // Animação de transição
      if (animationRef.current.active) {
        const anim = animationRef.current;
        anim.progress = Math.min(anim.progress + delta / anim.duration, 1);
        
        // Interpolação suave usando easing
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(anim.progress);
        
        // Interpolar posição
        camera.position.lerpVectors(
          anim.startPosition,
          anim.endPosition,
          easedProgress
        );
        
        // Interpolar target
        controlsRef.current.target.lerpVectors(
          anim.startTarget,
          anim.endTarget,
          easedProgress
        );
        
        // Atualizar controles
        controlsRef.current.update();
        
        // Finalizar animação
        if (anim.progress >= 1) {
          animationRef.current.active = false;
        }
      }

      // Movimento automático no modo auto
      if (mode === 'auto' && !animationRef.current.active) {
        const time = state.clock.elapsedTime;
        const radius = 8;
        const speed = 0.2;
        
        // Movimento circular suave
        const x = Math.cos(time * speed) * radius;
        const z = Math.sin(time * speed) * radius;
        
        // Interpolar para posição alvo
        targetRef.current.set(x, 2, z);
        camera.position.lerp(targetRef.current, 0.05);
        
        // Olhar para o centro
        controlsRef.current.target.lerp(new THREE.Vector3(0, 1.5, 0), 0.05);
        controlsRef.current.update();
        
        // Chamar callback de movimento
        if (onCameraMove) {
          onCameraMove(camera.position, controlsRef.current.target);
        }
      }

      // Movimento suave no modo guiado
      if (mode === 'guided' && !animationRef.current.active) {
        const time = state.clock.elapsedTime;
        const roomPos = roomPositions[targetRoom];
        if (roomPos) {
          // Pequena oscilação suave
          const oscillation = Math.sin(time * 0.5) * 0.1;
          camera.position.y = roomPos.position[1] + oscillation;
        }
      }
    }
  });

  // Configuração de controles baseada no modo
  const renderControls = () => {
    switch (mode) {
      case 'free':
      case 'guided':
      case 'auto':
        return (
          <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableZoom={config.enableZoom}
            enablePan={config.enablePan}
            enableRotate={mode !== 'auto'}
            maxPolarAngle={config.maxPolarAngle}
            minDistance={config.minDistance}
            maxDistance={config.maxDistance}
            dampingFactor={config.dampingFactor}
            rotateSpeed={mode === 'auto' ? 0 : 0.5}
            zoomSpeed={0.5}
            panSpeed={0.5}
            screenSpacePanning={false}
            minAzimuthAngle={-Infinity}
            maxAzimuthAngle={Infinity}
            onChange={() => {
              if (onCameraMove && mode === 'free') {
                onCameraMove(camera.position, controlsRef.current.target);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderControls()}
      
      {/* Marcador de posição para modo guiado */}
      {mode === 'guided' && targetRoom && (
        <mesh position={roomPositions[targetRoom]?.target || [0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color="#FF6B8B"
            transparent
            opacity={0.5}
            emissive="#FF6B8B"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      
      {/* Linha guia para modo guiado */}
      {mode === 'guided' && targetRoom && animationRef.current.active && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                ...camera.position.toArray(),
                ...targetRef.current.toArray()
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#FF6B8B" linewidth={2} />
        </line>
      )}
      
      {/* Placar de informações da câmera (debug) */}
      {process.env.NODE_ENV === 'development' && (
        <Html position={[0, 5, 0]}>
          <div className="bg-black/50 backdrop-blur-sm text-white text-xs p-2 rounded">
            <div>Mode: {mode}</div>
            <div>Room: {targetRoom}</div>
            <div>Pos: {camera.position.x.toFixed(1)}, {camera.position.y.toFixed(1)}, {camera.position.z.toFixed(1)}</div>
          </div>
        </Html>
      )}
    </>
  );
}