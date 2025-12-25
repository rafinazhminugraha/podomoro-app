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
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Music Toggle */}
      <button
        onClick={onToggleMusic}
        disabled={disabled}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-xl
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isMusicEnabled
            ? 'bg-white/10 text-white border border-white/20'
            : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/8'
          }
        `}
      >
        <MusicIcon enabled={isMusicEnabled} />
        <span className="text-sm font-medium">
          {isMusicEnabled ? 'Music On' : 'Music Off'}
        </span>
        <Toggle enabled={isMusicEnabled} />
      </button>
    </div>
  );
}

interface ToggleProps {
  enabled: boolean;
}

function Toggle({ enabled }: ToggleProps) {
  return (
    <div
      className={`
        relative w-10 h-6 rounded-full transition-colors duration-300
        ${enabled ? 'bg-rose-500' : 'bg-white/20'}
      `}
    >
      <div
        className={`
          absolute top-1 w-4 h-4 rounded-full bg-white shadow-md
          transition-transform duration-300
          ${enabled ? 'left-5' : 'left-1'}
        `}
      />
    </div>
  );
}

interface MusicIconProps {
  enabled: boolean;
}

function MusicIcon({ enabled }: MusicIconProps) {
  return (
    <svg
      className={`w-5 h-5 transition-colors duration-300 ${enabled ? 'text-rose-400' : 'text-white/40'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {enabled ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </>
      )}
    </svg>
  );
}
