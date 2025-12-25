'use client';

import { TimerStatus, TimerState } from '@/types';

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

  const iconButtonClasses = `
    group relative w-16 h-16 rounded-xl border transition-all duration-300
    flex items-center justify-center cursor-pointer
    outline-none
    disabled:opacity-30 disabled:cursor-not-allowed
    active:scale-95
  `;

  // Idle state - show Start button
  if (timerStatus === 'idle') {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onStart}
          disabled={!hasTemplate}
          className={`
            ${iconButtonClasses}
            ${hasTemplate 
              ? 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30' 
              : 'bg-white/2 border-white/6'
            }
          `}
          title="Start Focus"
        >
          <PlayIcon className="w-7 h-7 text-white/80" />
        </button>
      </div>
    );
  }

  // Running state - show Pause and Reset buttons
  if (timerStatus === 'running') {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onPause}
          className={`
            ${iconButtonClasses}
            bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30
          `}
          title="Pause"
        >
          <PauseIcon className="w-7 h-7 text-white/80" />
        </button>
        
        <button
          onClick={onReset}
          className={`
            ${iconButtonClasses}
            bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10
          `}
          title="Reset"
        >
          <ResetIcon className="w-6 h-6 text-white/50" />
        </button>
      </div>
    );
  }

  // Paused state - show Resume and Reset buttons
  if (timerStatus === 'paused') {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onResume}
          className={`
            ${iconButtonClasses}
            bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30
          `}
          title="Resume"
        >
          <PlayIcon className="w-7 h-7 text-white/80" />
        </button>
        
        <button
          onClick={onReset}
          className={`
            ${iconButtonClasses}
            bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10
          `}
          title="Reset"
        >
          <ResetIcon className="w-6 h-6 text-white/50" />
        </button>
      </div>
    );
  }

  return null;
}

// Icon Components - Refined, lighter strokes
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
      />
    </svg>
  );
}
