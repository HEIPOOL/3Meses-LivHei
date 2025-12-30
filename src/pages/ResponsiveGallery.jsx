// src/pages/ResponsiveGallery.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ResponsiveGallery3D = ({ items = [] }) => {
  const mountRef = useRef(null);
  const [scene] = useState(new THREE.Scene());
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [canvasHeight, setCanvasHeight] = useState('90vh');

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

  // Atualiza altura responsiva
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
    if (!mountRef.current) return;

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

    const rendererInstance = new THREE.WebGLRenderer({ antialias: config.renderer.antialias });
    rendererInstance.setPixelRatio(config.renderer.pixelRatio);
    rendererInstance.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    rendererInstance.shadowMap.enabled = config.gallery.enableShadows;
    rendererInstance.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(rendererInstance.domElement);
    setRenderer(rendererInstance);

    const controlsInstance = new OrbitControls(cameraInstance, rendererInstance.domElement);
    controlsInstance.enableZoom = config.controls.enableZoom;
    controlsInstance.enablePan = config.controls.enablePan;
    controlsInstance.enableRotate = config.controls.enableRotate;
    controlsInstance.zoomSpeed = config.controls.zoomSpeed;
    controlsInstance.rotateSpeed = config.controls.sensitivity;
    controlsInstance.panSpeed = config.controls.sensitivity;
    setControls(controlsInstance);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = config.gallery.enableShadows;
    scene.add(directionalLight);

    return () => {
      rendererInstance.dispose();
      controlsInstance.dispose();
      mountRef.current?.removeChild(rendererInstance.domElement);
    };
  }, [config, scene]);

  // Criar/atualizar objetos
  useEffect(() => {
    scene.children = scene.children.filter(child => child.type !== 'Mesh' && child.type !== 'Group');

    const itemsToShow = items.slice(0, config.gallery.maxItemsVisible);
    const columns = config.gallery.gridColumns;
    const rows = Math.ceil(itemsToShow.length / columns);

    itemsToShow.forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const x = (col - (columns - 1) / 2) * config.gallery.spacing;
      const y = -(row - (rows - 1) / 2) * config.gallery.spacing;

      const geometry = new THREE.BoxGeometry(
        config.gallery.itemScale,
        config.gallery.itemScale,
        config.gallery.itemScale
      );
      const material = new THREE.MeshStandardMaterial({
        color: item.color || 0xffffff,
        roughness: 0.4,
        metalness: 0.6
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      mesh.castShadow = config.gallery.enableShadows;
      mesh.receiveShadow = config.gallery.enableShadows;

      scene.add(mesh);
    });
  }, [items, config, scene]);

  // Animação
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (isAnimating && renderer && camera) {
        controls?.update();

        scene.children.forEach(child => {
          if (child.type === 'Mesh') {
            child.rotation.x += 0.005 * config.gallery.animationSpeed;
            child.rotation.y += 0.01 * config.gallery.animationSpeed;
          }
        });

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [renderer, camera, scene, controls, isAnimating, config]);

  // Redimensionamento da câmera
  useEffect(() => {
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
  }, [camera, renderer]);

  return (
    <div className="gallery-container">
      <div 
        ref={mountRef} 
        className="three-canvas"
        style={{ width: '100%', height: canvasHeight }}
      />

      <div className="gallery-controls">
        <button onClick={() => setIsAnimating(!isAnimating)} className="control-btn">
          {isAnimating ? 'Pausar' : 'Iniciar'} Animação
        </button>

        <button onClick={() => controls?.reset()} className="control-btn">
          Resetar Vista
        </button>
      </div>
    </div>
  );
};

export default ResponsiveGallery3D;
