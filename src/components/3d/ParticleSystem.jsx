// src/components/3d/ParticleSystem.jsx - CORRIGIDO
import * as THREE from 'three'; // ADICIONAR ESTA LINHA
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ParticleSystem({ count = 100, colors = ['#FF6B8B', '#D4AF37'] }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Criar partículas
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.02;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -10 + Math.random() * 20;
      const zFactor = -20 + Math.random() * 40;
      
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  // Criar geometria das partículas
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);

  // Material das partículas
  const particlesMaterial = useMemo(() => 
    new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(colors[0]),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    }), [colors]
  );

  // Animação
  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={particlesGeometry} material={particlesMaterial} />
  );
}