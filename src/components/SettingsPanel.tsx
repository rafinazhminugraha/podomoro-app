'use client';

import { Music, VolumeX } from 'lucide-react';

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
    group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
    rounded-xl border transition-all duration-300
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
      {isMusicEnabled ? (
        <Music 
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/80 transition-colors duration-300" 
          strokeWidth={1.5} 
        />
      ) : (
        <VolumeX 
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/40 transition-colors duration-300" 
          strokeWidth={1.5} 
        />
      )}
    </button>
  );
}
