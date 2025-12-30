import { useState, useEffect, useRef, useCallback } from 'react';

export interface Track {
  id: string;
  src: string;
  title?: string;
  artist?: string;
  artwork?: string;
}

interface UseAudioPlayerProps {
  playlist: Track[];
  autoplay?: boolean;
  startMuted?: boolean;
  initialVolume?: number;
  persistKey?: string | null;
  onTrackChange?: (trackId: string) => void;
  crossfadeDuration?: number;
}

export const useAudioPlayer = ({
  playlist,
  autoplay = false,
  startMuted = true,
  initialVolume = 0.7,
  persistKey = null,
  onTrackChange,
  crossfadeDuration = 0,
}: UseAudioPlayerProps) => {
  // Refs para os elementos de áudio e controle de animação
  const audioRef = useRef<HTMLAudioElement>(null);
  const secondaryAudioRef = useRef<HTMLAudioElement>(null); // Para crossfade
  const animationFrameRef = useRef<number>(0);
  const userInteracted = useRef(false); // Controle de política de autoplay

  // Estado do player
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [isShuffle, setIsShuffle] = useState(false);
  const [loopMode, setLoopMode] = useState<'none' | 'all' | 'one'>('none');
  const [playHistory, setPlayHistory] = useState<number[]>([]); // Para shuffle
  const [error, setError] = useState<string | null>(null);

  const currentTrack = playlist[currentTrackIndex];

  // ===== PERSISTÊNCIA (localStorage) =====
  useEffect(() => {
    if (!persistKey) return;
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        const { trackIndex, volume: savedVolume, time } = JSON.parse(saved);
        // Valida se o índice salvo ainda é válido para a playlist atual
        if (trackIndex >= 0 && trackIndex < playlist.length) {
          setCurrentTrackIndex(trackIndex);
          setVolume(savedVolume);
          // O tempo será aplicado quando o áudio carregar
          if (audioRef.current && time > 0) {
            audioRef.current.currentTime = time;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load persisted player state:', e);
    }
  }, [persistKey, playlist.length]);

  // Salvar estado periodicamente e ao desmontar
  useEffect(() => {
    if (!persistKey) return;
    const saveState = () => {
      const state = {
        trackIndex: currentTrackIndex,
        volume,
        time: currentTime,
      };
      localStorage.setItem(persistKey, JSON.stringify(state));
    };
    // Salva a cada 5 segundos durante a reprodução
    const interval = isPlaying ? setInterval(saveState, 5000) : null;
    return () => {
      if (interval) clearInterval(interval);
      saveState(); // Salva uma última vez ao desmontar
    };
  }, [persistKey, currentTrackIndex, volume, currentTime, isPlaying]);

  // ===== GERENCIAMENTO DO ELEMENTO <audio> =====
  const setupAudio = useCallback((audioElement: HTMLAudioElement | null) => {
    if (!audioElement) return;
    const updateProgress = () => {
      setCurrentTime(audioElement.currentTime);
      setDuration(audioElement.duration || 0);
      if (isPlaying && audioElement.duration) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
      // Aplica mute inicial se necessário para políticas de autoplay
      if (startMuted && !userInteracted.current) {
        audioElement.muted = true;
        setIsMuted(true);
      }
      audioElement.volume = volume;
    };
    const handleEnded = () => handleNext();
    const handleError = (e: Event) => {
      const errorCode = (audioElement.error as MediaError)?.code;
      const errorMsg = `Erro ao carregar áudio (${errorCode}). Próxima faixa em 3s.`;
      setError(errorMsg);
      console.error('Audio error:', audioElement.error);
      // Fallback: tenta próxima faixa após 3 segundos
      setTimeout(() => handleNext(), 3000);
    };
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    // Inicia o loop de atualização de progresso se estiver tocando
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, startMuted, volume]);

  // Efeito principal para configurar o áudio
  useEffect(() => {
    const cleanup = setupAudio(audioRef.current);
    return () => {
      if (cleanup) cleanup();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [setupAudio]);

  // ===== MEDIA SESSION API (integração com SO) =====
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;
    const { mediaSession } = navigator;
    mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title || 'Unknown Track',
      artist: currentTrack.artist || 'Unknown Artist',
      artwork: currentTrack.artwork ? [{ src: currentTrack.artwork, sizes: '512x512', type: 'image/jpeg' }] : [],
    });
    mediaSession.setActionHandler('play', handlePlay);
    mediaSession.setActionHandler('pause', handlePause);
    mediaSession.setActionHandler('previoustrack', handlePrevious);
    mediaSession.setActionHandler('nexttrack', handleNext);
    mediaSession.setActionHandler('seekbackward', () => handleSeek(-10));
    mediaSession.setActionHandler('seekforward', () => handleSeek(10));
    mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    return () => {
      mediaSession.metadata = null;
      // Remove todos os handlers
      ['play', 'pause', 'previoustrack', 'nexttrack', 'seekbackward', 'seekforward'].forEach(action => {
        mediaSession.setActionHandler(action as any, null);
      });
    };
  }, [currentTrack, isPlaying]);

  // ===== CONTROLES DO PLAYER =====
  const handlePlay = useCallback(() => {
    if (!audioRef.current) return;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setError(null);
          // Inicia o loop de animação para a barra de progresso
          animationFrameRef.current = requestAnimationFrame(() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration);
            }
          });
        })
        .catch(e => {
          // Falha comum se o usuário não interagiu com a página
          if (!userInteracted.current) {
            setError('Interaction required. Click anywhere to enable playback.');
          }
          console.error('Playback failed:', e);
        });
    }
  }, []);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!userInteracted.current) {
      // Marca a primeira interação e desmuta se necessário
      userInteracted.current = true;
      if (audioRef.current && isMuted && startMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
    isPlaying ? handlePause() : handlePlay();
  }, [isPlaying, handlePlay, handlePause, isMuted, startMuted]);

  const handleSeek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const handleSetTime = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleNext = useCallback(() => {
    setError(null);
    let nextIndex;
    if (isShuffle) {
      // Lógica de shuffle: evita repetir até que todas toquem
      const availableIndices = playlist
        .map((_, idx) => idx)
        .filter(idx => idx !== currentTrackIndex && !playHistory.includes(idx));
      if (availableIndices.length === 0) {
        // Reinicia o histórico se todas tocaram
        setPlayHistory([]);
        nextIndex = (currentTrackIndex + 1) % playlist.length;
      } else {
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
      setPlayHistory(prev => [...prev, currentTrackIndex]);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    if (loopMode === 'one') {
      // No loop "uma faixa", reinicia a mesma
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    if (nextIndex === 0 && loopMode === 'none') {
      // Fim da playlist sem loop
      handlePause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    setCurrentTrackIndex(nextIndex);
    onTrackChange?.(playlist[nextIndex].id);
    // Força uma atualização do tempo após trocar a fonte
    setCurrentTime(0);
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      playPromise.catch(e => console.error('Auto-play after next failed:', e));
    }
  }, [currentTrackIndex, isPlaying, isShuffle, loopMode, playlist, onTrackChange, handlePause, playHistory]);

  const handlePrevious = useCallback(() => {
    if (currentTime > 3) {
      // Se já passou 3s, volta ao início da mesma faixa
      handleSetTime(0);
    } else {
      // Volta para a faixa anterior
      let prevIndex;
      if (isShuffle && playHistory.length > 0) {
        // No shuffle, volta no histórico
        const history = [...playHistory];
        prevIndex = history.pop() || currentTrackIndex - 1;
        setPlayHistory(history);
      } else {
        prevIndex = currentTrackIndex - 1 < 0 ? playlist.length - 1 : currentTrackIndex - 1;
      }
      setCurrentTrackIndex(prevIndex);
      onTrackChange?.(playlist[prevIndex].id);
      handleSetTime(0);
    }
  }, [currentTime, currentTrackIndex, isShuffle, playlist, onTrackChange, handleSetTime, playHistory]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      setVolume(0);
    } else {
      setVolume(initialVolume);
      if (audioRef.current) audioRef.current.volume = initialVolume;
    }
  }, [isMuted, initialVolume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
    setPlayHistory([]);
  }, []);

  const toggleLoop = useCallback(() => {
    setLoopMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  // ===== LISTENERS DE TECLADO GLOBAL =====
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evita conflito com entradas de texto
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) handlePrevious();
          else handleSeek(-10);
          break;
        case 'ArrowRight':
          if (e.shiftKey) handleNext();
          else handleSeek(10);
          break;
        case 'n':
        case 'N':
          if (e.shiftKey) {
            e.preventDefault();
            handleNext();
          }
          break;
        case 'p':
        case 'P':
          if (e.shiftKey) {
            e.preventDefault();
            handlePrevious();
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleSeek, handleNext, handlePrevious]);

  // ===== AUTOPLAY SEGURO =====
  useEffect(() => {
    // Marca interação do usuário para liberar autoplay
    const handleUserInteraction = () => {
      userInteracted.current = true;
      if (audioRef.current && isMuted && startMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
      if (autoplay && !isPlaying) {
        handlePlay();
      }
      // Remove listeners após a primeira interação
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
    if (autoplay && !userInteracted.current) {
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, { once: true });
      document.addEventListener('scroll', handleUserInteraction, { once: true });
    }
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [autoplay, isPlaying, startMuted, isMuted, handlePlay]);

  // ===== PAUSAR QUANDO A ABA ESTÁ OCULTA (OPCIONAL) =====
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (audioRef.current && document.visibilityState === 'hidden' && isPlaying) {
        audioRef.current.pause();
        // Nota: não alteramos setIsPlaying aqui para poder retomar depois
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  return {
    // Estado
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    loopMode,
    error,
    // Refs
    audioRef,
    // Controles
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleSeek,
    handleSetTime,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    // Interação
    userInteracted,
  };
};