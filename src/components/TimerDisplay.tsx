'use client';

import { formatTime, calculateProgress, getStateColor } from '@/lib/utils';
import { TimerState, TimerStatus } from '@/types';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  timerState: TimerState;
  timerStatus: TimerStatus;
}

export function TimerDisplay({ 
  timeRemaining, 
  totalTime, 
  timerState,
  timerStatus 
}: TimerDisplayProps) {
  const progress = calculateProgress(timeRemaining, totalTime);
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const stateColor = getStateColor(timerState);

  const getStateLabel = () => {
    switch (timerState) {
      case 'focus':
        return 'Focus';
      case 'break':
        return 'Break';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Circular Progress - Responsive sizes */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72">
        {/* Subtle glow effect - always visible */}
        <div 
          className="absolute inset-3 sm:inset-4 rounded-full blur-xl sm:blur-2xl opacity-15 transition-all duration-1000"
          style={{ backgroundColor: timerState === 'idle' ? '#ffffff' : stateColor }}
        />
        
        {/* SVG Progress Ring */}
        <svg 
          className="w-full h-full -rotate-90 transform"
          viewBox="0 0 300 300"
        >
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-white/6"
          />
          
          {/* Progress circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke={timerStatus !== 'idle' ? stateColor : 'rgba(255,255,255,0.1)'}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5">
          {/* State Label */}
          <span 
            className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-500"
            style={{ color: timerStatus !== 'idle' ? stateColor : 'rgba(255,255,255,0.4)' }}
          >
            {getStateLabel()}
          </span>
          
          {/* Time Display - Centered anchor */}
          <span className="text-4xl sm:text-5xl md:text-5xl font-extralight tracking-tight text-white font-mono tabular-nums">
            {formatTime(timeRemaining)}
          </span>
          
          {/* Status Indicator */}
          {timerStatus !== 'idle' ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span 
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${timerStatus === 'running' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: timerStatus === 'paused' ? 'rgba(255,255,255,0.4)' : stateColor }}
              />
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
                {timerStatus === 'paused' ? 'Paused' : timerState === 'focus' ? 'Focusing' : 'Resting'}
              </span>
            </div>
          ) : (
            <div className="h-4 sm:h-5" /> 
          )}
        </div>
      </div>
    </div>
  );
}
