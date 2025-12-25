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
  const circumference = 2 * Math.PI * 140; // radius = 140
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const stateColor = getStateColor(timerState);

  const getStateLabel = () => {
    switch (timerState) {
      case 'focus':
        return 'Focus Time';
      case 'break':
        return 'Break Time';
      default:
        return 'Ready';
    }
  };

  const getStatusIndicator = () => {
    if (timerStatus === 'paused') {
      return (
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-medium uppercase tracking-wider">Paused</span>
        </div>
      );
    }
    if (timerStatus === 'running') {
      return (
        <div className="flex items-center gap-2" style={{ color: stateColor }}>
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: stateColor }}
          />
          <span className="text-sm font-medium uppercase tracking-wider">
            {timerState === 'focus' ? 'Focusing' : 'Resting'}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Circular Progress */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96">
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000"
          style={{ backgroundColor: stateColor }}
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
            strokeWidth="4"
            fill="none"
            className="text-white/5"
          />
          
          {/* Progress circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke={stateColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 20px ${stateColor}40)`,
            }}
          />
        </svg>

        {/* Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* State Label */}
          <span 
            className="text-lg font-medium tracking-wide mb-2 transition-colors duration-500"
            style={{ color: stateColor }}
          >
            {getStateLabel()}
          </span>
          
          {/* Time Display */}
          <span className="text-6xl sm:text-7xl font-light tracking-tight text-white font-mono tabular-nums">
            {formatTime(timeRemaining)}
          </span>
          
          {/* Status Indicator */}
          <div className="mt-4 h-6">
            {getStatusIndicator()}
          </div>
        </div>
      </div>
    </div>
  );
}
