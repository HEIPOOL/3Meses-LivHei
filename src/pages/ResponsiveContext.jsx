// src/pages/ResponsiveGallery.jsx
'use client'; // ADICIONE ESTA LINHA

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importe Three.js apenas no cliente
const ResponsiveGallery3D = dynamic(
  () => {
    return Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls')
    ]).then(([THREE, { OrbitControls }]) => {
      return function ResponsiveGallery3DComponent({ items = [] }) {
        const mountRef = useRef(null);
        const [scene] = useState(() => new THREE.Scene());
        const [camera, setCamera] = useState(null);
        const [renderer, setRenderer] = useState(null);
        const [controls, setControls] = useState(null);
        const [isAnimating, setIsAnimating] = useState(true);
        const [canvasHeight, setCanvasHeight] = useState('90vh');
        const [isInitialized, setIsInitialized] = useState(false);

        // Configuração responsiva segura
        const config = {
          camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 2, z: 5 }
          },
          renderer: {
            antialias: true,
            pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
          },
          controls: {
            enableZoom: true,
            enablePan: true,
            enableRotate: true,
            zoomSpeed: 0.5,
            sensitivity: 0.5
          },
          gallery: {
            maxItemsVisible: 20,
            gridColumns: 4,
            spacing: 2.5,
            itemScale: 1,
            enableShadows: true,
            animationSpeed: 1
          }
        };

        // Atualiza altura responsiva - APENAS NO CLIENTE
        useEffect(() => {
          if (typeof window === 'undefined') return;

          const updateHeight = () => {
            setCanvasHeight(window.innerWidth <= 768 ? '70vh' : '90vh');
          };

          updateHeight();
          window.addEventListener('resize', updateHeight);
          return () => window.removeEventListener('resize', updateHeight);
        }, []);

        // Inicialização da cena
        useEffect(() => {
          if (!mountRef.current || isInitialized) return;
          
          // Configuração da câmera
          const cameraInstance = new THREE.PerspectiveCamera(
            config.camera.fov,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            config.camera.near,
            config.camera.far
          );
          cameraInstance.position.set(
            config.camera.position.x,
            config.camera.position.y,
            config.camera.position.z
          );
          setCamera(cameraInstance);

          // Configuração do renderer
          const rendererInstance = new THREE.WebGLRenderer({ 
            antialias: config.renderer.antialias,
            alpha: true 
          });
          rendererInstance.setPixelRatio(config.renderer.pixelRatio);
          rendererInstance.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
          );
          rendererInstance.shadowMap.enabled = config.gallery.enableShadows;
          rendererInstance.shadowMap.type = THREE.PCFSoftShadowMap;

          mountRef.current.appendChild(rendererInstance.domElement);
          setRenderer(rendererInstance);

          // Controles
          const controlsInstance = new OrbitControls(cameraInstance, rendererInstance.domElement);
          controlsInstance.enableZoom = config.controls.enableZoom;
          controlsInstance.enablePan = config.controls.enablePan;
          controlsInstance.enableRotate = config.controls.enableRotate;
          controlsInstance.zoomSpeed = config.controls.zoomSpeed;
          controlsInstance.rotateSpeed = config.controls.sensitivity;
          controlsInstance.panSpeed = config.controls.sensitivity;
          setControls(controlsInstance);

          // Luzes
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(5, 5, 5);
          directionalLight.castShadow = config.gallery.enableShadows;
          scene.add(directionalLight);

          // Chão
          const floorGeometry = new THREE.PlaneGeometry(20, 20);
          const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            roughness: 0.8,
            metalness: 0.2
          });
          const floor = new THREE.Mesh(floorGeometry, floorMaterial);
          floor.rotation.x = -Math.PI / 2;
          floor.position.y = -1;
          floor.receiveShadow = true;
          scene.add(floor);

          setIsInitialized(true);

          // Cleanup
          return () => {
            if (rendererInstance) {
              rendererInstance.dispose();
              controlsInstance.dispose();
              mountRef.current?.removeChild(rendererInstance.domElement);
            }
          };
        }, [isInitialized]);

        // Criar/atualizar objetos
        useEffect(() => {
          if (!isInitialized) return;

          // Remove apenas objetos visuais antigos
          const visualObjects = scene.children.filter(child => 
            child.type === 'Mesh' && child !== scene.children.find(c => c.userData?.isFloor)
          );
          
          visualObjects.forEach(obj => scene.remove(obj));

          const itemsToShow = items.slice(0, config.gallery.maxItemsVisible);
          const columns = config.gallery.gridColumns;
          const rows = Math.ceil(itemsToShow.length / columns);

          itemsToShow.forEach((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);

            const x = (col - (columns - 1) / 2) * config.gallery.spacing;
            const y = 0;
            const z = -(row - (rows - 1) / 2) * config.gallery.spacing;

            const geometry = new THREE.BoxGeometry(
              config.gallery.itemScale,
              config.gallery.itemScale * 2,
              config.gallery.itemScale
            );
            
            // Cor baseada no item ou aleatória
            const hue = (index * 137.508) % 360; // Golden angle
            const color = new THREE.Color(`hsl(${hue}, 70%, 60%)`);
            
            const material = new THREE.MeshStandardMaterial({
              color: item.color || color,
              roughness: 0.4,
              metalness: 0.6
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = config.gallery.enableShadows;
            mesh.receiveShadow = config.gallery.enableShadows;

            scene.add(mesh);
          });
        }, [items, isInitialized]);

        // Animação
        useEffect(() => {
          let animationFrameId;

          const animate = () => {
            if (isAnimating && renderer && camera && isInitialized) {
              controls?.update();

              scene.children.forEach((child, index) => {
                if (child.type === 'Mesh' && !child.userData?.isFloor) {
                  child.rotation.x += 0.005 * config.gallery.animationSpeed;
                  child.rotation.y += 0.01 * config.gallery.animationSpeed;
                  
                  // Adiciona flutuação suave
                  child.position.y = Math.sin(Date.now() * 0.001 + index) * 0.2;
                }
              });

              renderer.render(scene, camera);
            }
            animationFrameId = requestAnimationFrame(animate);
          };

          if (isInitialized) {
            animate();
          }
          
          return () => cancelAnimationFrame(animationFrameId);
        }, [renderer, camera, scene, controls, isAnimating, isInitialized]);

        // Redimensionamento responsivo
        useEffect(() => {
          if (!isInitialized) return;

          const handleResize = () => {
            if (!camera || !renderer || !mountRef.current) return;

            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(
              mountRef.current.clientWidth,
              mountRef.current.clientHeight
            );
          };

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, [camera, renderer, isInitialized]);

        return (
          <div className="gallery-container">
            <div 
              ref={mountRef} 
              className="three-canvas"
              style={{ 
                width: '100%', 
                height: canvasHeight,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              }}
            />

            <div className="gallery-controls flex gap-4 p-4 justify-center">
              <button 
                onClick={() => setIsAnimating(!isAnimating)} 
                className="control-btn px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {isAnimating ? '⏸️ Pausar' : '▶️ Iniciar'}
              </button>

              <button 
                onClick={() => controls?.reset()} 
                className="control-btn px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                🔄 Resetar Vista
              </button>
            </div>
          </div>
        );
      };
    });
  },
  { 
    ssr: false, // Desabilita SSR para este componente
    loading: () => (
      <div className="w-full h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-lg">Carregando galeria 3D...</div>
      </div>
    )
  }
);

export default function ResponsiveGalleryPage() {
  const [items, setItems] = useState([]);

  // Exemplo de dados
  useEffect(() => {
    setItems([
      { id: 1, color: '#FF6B8B' },
      { id: 2, color: '#FFD700' },
      { id: 3, color: '#9D00FF' },
      { id: 4, color: '#00D4FF' },
      { id: 5, color: '#FF1493' },
      { id: 6, color: '#FFA500' },
      { id: 7, color: '#FFEAA7' },
      { id: 8, color: '#B8860B' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <header className="p-6 text-center">
        <h1 className="font-cinzel text-3xl md:text-4xl text-white mb-2">
          Galeria Responsiva 3D
        </h1>
        <p className="text-gray-300">
          Experiência imersiva com Three.js
        </p>
      </header>
      
      <ResponsiveGallery3D items={items} />
      
      <div className="p-6 text-center text-gray-400 text-sm">
        <p>Arraste para rotacionar • Scroll para zoom • Clique e arraste para mover</p>
      </div>
    </div>
  );
}