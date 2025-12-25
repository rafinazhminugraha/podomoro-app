'use client';

interface SettingsPanelProps {
  isMusicEnabled: boolean;
  onToggleMusic: () => void;
  disabled?: boolean;
}

export function SettingsPanel({
  isMusicEnabled,
  onToggleMusic,
  disabled = false,
}: SettingsPanelProps) {
  const iconButtonClasses = `
    group relative w-16 h-16 rounded-xl border transition-all duration-300
    flex items-center justify-center cursor-pointer
    outline-none
    disabled:opacity-30 disabled:cursor-not-allowed
    active:scale-95
  `;

  return (
    <button
      onClick={onToggleMusic}
      disabled={disabled}
      className={`
        ${iconButtonClasses}
        ${isMusicEnabled
          ? 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
          : 'bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10'
        }
      `}
      title={isMusicEnabled ? 'Mute Music' : 'Unmute Music'}
    >
      <MusicIcon enabled={isMusicEnabled} />
    </button>
  );
}

interface MusicIconProps {
  enabled: boolean;
}

function MusicIcon({ enabled }: MusicIconProps) {
  return (
    <svg
      className={`w-6 h-6 transition-colors duration-300 ${enabled ? 'text-white/80' : 'text-white/40'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {enabled ? (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
        />
      ) : (
        <>
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
          />
        </>
      )}
    </svg>
  );
}
