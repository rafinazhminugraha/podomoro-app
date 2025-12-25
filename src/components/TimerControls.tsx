'use client';

import { TimerStatus, TimerState } from '@/types';
import { getStateColor } from '@/lib/utils';

interface TimerControlsProps {
  timerStatus: TimerStatus;
  timerState: TimerState;
  hasTemplate: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function TimerControls({
  timerStatus,
  timerState,
  hasTemplate,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  const stateColor = getStateColor(timerState);

  const buttonBaseClasses = `
    relative overflow-hidden px-8 py-4 rounded-2xl font-medium text-lg
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-40 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${stateColor}dd, ${stateColor}99)`,
    boxShadow: `0 10px 40px ${stateColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
  };

  const secondaryButtonClasses = `
    ${buttonBaseClasses}
    bg-white/5 text-white/80 hover:bg-white/10 hover:text-white
    border border-white/10 hover:border-white/20
    focus:ring-white/30
  `;

  // Idle state - show Start button
  if (timerStatus === 'idle') {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          disabled={!hasTemplate}
          className={`${buttonBaseClasses} text-white focus:ring-rose-500`}
          style={primaryButtonStyle}
        >
          <span className="relative z-10 flex items-center gap-3">
            <PlayIcon />
            Start Focus
          </span>
        </button>
        
        {!hasTemplate && (
          <p className="text-white/40 text-sm">
            Select a mode to begin
          </p>
        )}
      </div>
    );
  }

  // Running state - show Pause and Reset buttons
  if (timerStatus === 'running') {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={onPause}
          className={`${buttonBaseClasses} bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 focus:ring-amber-500`}
        >
          <span className="flex items-center gap-3">
            <PauseIcon />
            Pause
          </span>
        </button>
        
        <button
          onClick={onReset}
          className={secondaryButtonClasses}
        >
          <span className="flex items-center gap-3">
            <ResetIcon />
            Reset
          </span>
        </button>
      </div>
    );
  }

  // Paused state - show Resume and Reset buttons
  if (timerStatus === 'paused') {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={onResume}
          className={`${buttonBaseClasses} text-white focus:ring-rose-500`}
          style={primaryButtonStyle}
        >
          <span className="relative z-10 flex items-center gap-3">
            <PlayIcon />
            Resume
          </span>
        </button>
        
        <button
          onClick={onReset}
          className={secondaryButtonClasses}
        >
          <span className="flex items-center gap-3">
            <ResetIcon />
            Reset
          </span>
        </button>
      </div>
    );
  }

  return null;
}

// Icon Components
function PlayIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
