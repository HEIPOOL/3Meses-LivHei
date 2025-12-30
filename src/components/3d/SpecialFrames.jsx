// src/components/3d/SpecialFrames.jsx

// Frame para momentos especiais com efeitos
export function SpecialOccasionFrame({ occasion, photo, ...props }) {
  const particleRef = useRef();
  const [sparkles, setSparkles] = useState([]);
  
  useFrame((state) => {
    if (particleRef.current) {
      particleRef.current.rotation.y += 0.01;
      
      // Criar novos sparkles aleatórios
      if (Math.random() < 0.1) {
        setSparkles(prev => [
          ...prev.slice(-50), // Mantém apenas os últimos 50
          {
            id: Date.now() + Math.random(),
            position: [
              (Math.random() - 0.5) * 3,
              (Math.random() - 0.5) * 4,
              0.5
            ],
            scale: Math.random() * 0.1 + 0.05
          }
        ]);
      }
    }
  });
  
  return (
    <group ref={particleRef}>
      <InteractiveFrame
        photo={photo}
        frameType="golden"
        {...props}
      />
      
      {/* Sparkles especiais */}
      {sparkles.map(sparkle => (
        <mesh
          key={sparkle.id}
          position={sparkle.position}
          scale={sparkle.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Coroa decorativa */}
      <mesh position={[0, 2.8, 0.1]}>
        <ringGeometry args={[1.2, 1.5, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Frame interativo com mais detalhes
export function InteractiveMemoryFrame({ memory, onMemoryPlay, ...props }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
    if (onMemoryPlay) onMemoryPlay(memory);
  };
  
  return (
    <group>
      <InteractiveFrame
        photo={memory.photo}
        frameType="romantic"
        {...props}
      />
      
      {/* Botão de play para memórias com áudio/vídeo */}
      {memory.hasMedia && (
        <Html
          position={[0, 0, 0.5]}
          center
          distanceFactor={10}
        >
          <button
            onClick={handlePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center
                       transition-all duration-300 hover:scale-110 ${
                         isPlaying 
                           ? 'bg-[var(--color-accent)]' 
                           : 'bg-[var(--color-primary)]'
                       }`}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </Html>
      )}
      
      {/* Timeline visual para memórias */}
      <mesh position={[0, -1.8, 0.1]}>
        <boxGeometry args={[2, 0.05, 0.02]} />
        <meshStandardMaterial color="#2A2A2A" />
      </mesh>
      
      <mesh position={[-0.8, -1.8, 0.11]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={isPlaying ? '#FF6B8B' : '#8B0000'} 
          emissive={isPlaying ? '#FF6B8B' : '#000000'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}