'use client';

import { TimerStatus, TimerState } from '@/types';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';

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
    group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
    rounded-xl border transition-all duration-300
    flex items-center justify-center cursor-pointer
    outline-none
    disabled:opacity-30 disabled:cursor-not-allowed
    active:scale-95
  `;

  // Idle state - show Start button
  if (timerStatus === 'idle') {
    return (
      <div className="flex flex-col gap-2 sm:gap-3">
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
          <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white/80" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Running state - show Pause and Reset buttons
  if (timerStatus === 'running') {
    return (
      <div className="flex flex-col gap-2 sm:gap-3">
        <button
          onClick={onPause}
          className={`
            ${iconButtonClasses}
            bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30
          `}
          title="Pause"
        >
          <PauseCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white/80" strokeWidth={1.5} />
        </button>
        
        <button
          onClick={onReset}
          className={`
            ${iconButtonClasses}
            bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10
          `}
          title="Reset"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/50" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Paused state - show Resume and Reset buttons
  if (timerStatus === 'paused') {
    return (
      <div className="flex flex-col gap-2 sm:gap-3">
        <button
          onClick={onResume}
          className={`
            ${iconButtonClasses}
            bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30
          `}
          title="Resume"
        >
          <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white/80" strokeWidth={1.5} />
        </button>
        
        <button
          onClick={onReset}
          className={`
            ${iconButtonClasses}
            bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10
          `}
          title="Reset"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/50" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return null;
}

