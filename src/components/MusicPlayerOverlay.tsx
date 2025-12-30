import React, { useState, useEffect } from 'react';
import { useAudioPlayer, Track } from '../hooks/useAudioPlayer';
import { MusicControls } from './MusicControls';

export interface MusicPlayerOverlayProps {
  playlist: Track[];
  autoplay?: boolean;
  startMuted?: boolean;
  volume?: number;
  persistKey?: string | null;
  onTrackChange?: (trackId: string) => void;
  crossfadeDuration?: number;
  className?: string;
}   

export const MusicPlayerOverlay: React.FC<MusicPlayerOverlayProps> = ({
  playlist,
  autoplay = false,
  startMuted = true,
  volume = 0.7,
  persistKey = null,
  onTrackChange,
  crossfadeDuration = 0,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta mobile vs desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume: currentVolume,
    isMuted,
    isShuffle,
    loopMode,
    error,
    audioRef,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleSeek,
    handleSetTime,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    userInteracted,
  } = useAudioPlayer({
    playlist,
    autoplay,
    startMuted,
    initialVolume: volume,
    persistKey,
    onTrackChange,
    crossfadeDuration,
  });

  // Pré-carrega a imagem da capa
  useEffect(() => {
    if (currentTrack?.artwork) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = currentTrack.artwork;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [currentTrack?.artwork]);

  // Elemento de áudio oculto
  const audioElement = (
    <audio
      ref={audioRef}
      src={currentTrack?.src}
      preload="metadata"
      aria-label={`Audio track: ${currentTrack?.title || 'Unknown'}`}
      onLoadedMetadata={() => {
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
          if (startMuted && !userInteracted.current) {
            audioRef.current.muted = true;
          }
        }
      }}
      className="hidden"
    />
  );

  // Conteúdo expandido (desktop) ou modal (mobile)
  const playerContent = (
    <>
      {audioElement}
      
      {/* Área de anúncio ARIA para leitores de tela */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {currentTrack && `Now playing: ${currentTrack.title} by ${currentTrack.artist}`}
        {isPlaying ? 'Playing' : 'Paused'}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div 
          className="bg-red-900/80 text-white p-3 rounded-lg mb-3 text-sm"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {/* Informações da faixa atual */}
      {currentTrack && (
        <div className="flex items-center space-x-3 mb-4">
          {currentTrack.artwork && (
            <img
              src={currentTrack.artwork}
              alt={`Album art for ${currentTrack.title}`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" title={currentTrack.title}>
              {currentTrack.title || 'Unknown Track'}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>
      )}

      {/* Controles */}
      <MusicControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={currentVolume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        loopMode={loopMode}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onSetTime={handleSetTime}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleShuffle={toggleShuffle}
        onToggleLoop={toggleLoop}
        disabled={!currentTrack}
      />
    </>
  );

  // ===== RENDERIZAÇÃO RESPONSIVA =====
  if (isMobile) {
    // Mobile: botão flutuante + modal
    return (
      <>
        {audioElement}
        {/* Botão flutuante */}
        <button
          onClick={() => setIsExpanded(true)}
          className={`fixed bottom-6 right-6 z-50 p-4 bg-blue-600 rounded-full shadow-2xl hover:bg-blue-700 transition-all ${className}`}
          aria-label="Open music player"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Modal/Slide-up (aparece quando expandido) */}
        {isExpanded && (
          <>
            {/* Overlay escuro */}
            <div
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setIsExpanded(false)}
              aria-hidden="true"
            />
            
            {/* Conteúdo do modal */}
            <div
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
              role="dialog"
              aria-label="Music player"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close player"
              >
                ✕
              </button>
              {playerContent}
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop: overlay lateral
  return (
    <>
      {audioElement}
      <div
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-14'
        } ${className}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Mini player recolhido */}
        {!isExpanded && (
          <button
            onClick={handlePlayPause}
            className="w-14 h-14 bg-gray-800/90 backdrop-blur-sm rounded-l-2xl shadow-lg flex items-center justify-center hover:bg-gray-700/90"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}

        {/* Player expandido */}
        {isExpanded && (
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-l-2xl shadow-2xl p-5 border-l border-gray-700/50">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-gray-800 w-6 h-12 rounded-l-lg hover:bg-gray-700"
              aria-label="Collapse player"
            >
              ◀
            </button>
            {playerContent}
          </div>
        )}
      </div>
    </>
  );
};

// Ícones auxiliares (repetidos para completude)
const PlayIcon = () => <span className="text-xl">▶</span>;
const PauseIcon = () => <span className="text-xl">⏸</span>;