import { FC, MouseEvent } from 'react';

interface MusicControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  loopMode: 'none' | 'all' | 'one';
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onSetTime: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  disabled?: boolean;
}

// Ícones SVG inline (simplificados para exemplo)
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const VolumeUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3v18l-4.5-4.5H4a1 1 0 01-1-1v-7a1 1 0 011-1h3.5z" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l4-4m0 0l-4-4m4 4H9" />
  </svg>
);

const ShuffleIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-blue-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const LoopIcon = ({ mode }: { mode: 'none' | 'all' | 'one' }) => {
  const getColor = () => {
    if (mode === 'none') return 'text-gray-500';
    if (mode === 'all') return 'text-green-500';
    return 'text-blue-500';
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${getColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      {mode === 'one' && <circle cx="12" cy="12" r="2" strokeWidth={2} />}
    </svg>
  );
};

export const MusicControls: FC<MusicControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  loopMode,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onSetTime,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleLoop,
  disabled = false,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSetTime(percent * duration);
  };

  return (
    <div className="space-y-4 p-4" role="group" aria-label="Music player controls">
      {/* Barra de Progresso */}
      <div className="space-y-1">
        <div
          className="h-2 bg-gray-700 rounded-full cursor-pointer hover:h-3 transition-all"
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={duration ? (currentTime / duration) * 100 : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Track progress"
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controles Principais */}
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={onToggleShuffle}
          disabled={disabled}
          aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
          className={`p-2 rounded-full ${isShuffle ? 'bg-blue-900/30' : 'hover:bg-gray-700'}`}
        >
          <ShuffleIcon active={isShuffle} />
        </button>

        <button
          onClick={onPrevious}
          disabled={disabled}
          aria-label="Previous track"
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <PrevIcon />
        </button>

        <button
          onClick={() => onSeek(-10)}
          disabled={disabled}
          aria-label="Rewind 10 seconds"
          className="p-2 rounded-full hover:bg-gray-700 text-sm font-semibold"
        >
          -10s
        </button>

        <button
          onClick={onPlayPause}
          disabled={disabled}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={() => onSeek(10)}
          disabled={disabled}
          aria-label="Forward 10 seconds"
          className="p-2 rounded-full hover:bg-gray-700 text-sm font-semibold"
        >
          +10s
        </button>

        <button
          onClick={onNext}
          disabled={disabled}
          aria-label="Next track"
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <NextIcon />
        </button>

        <button
          onClick={onToggleLoop}
          disabled={disabled}
          aria-label={`Loop mode: ${loopMode}`}
          className={`p-2 rounded-full ${loopMode !== 'none' ? 'bg-green-900/30' : 'hover:bg-gray-700'}`}
        >
          <LoopIcon mode={loopMode} />
        </button>
      </div>

      {/* Controle de Volume */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMute}
          disabled={disabled}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="p-1 rounded-full hover:bg-gray-700"
        >
          {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume * 100}
          onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
          disabled={disabled}
          aria-label="Volume control"
          className="w-24 accent-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-400 w-10">
          {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
        </span>
      </div>
    </div>
  );
};