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
      {/* Circular Progress */}
      <div className="relative w-72 h-72">
        {/* Subtle glow effect */}
        {timerStatus !== 'idle' && (
          <div 
            className="absolute inset-4 rounded-full blur-2xl opacity-10 transition-all duration-1000"
            style={{ backgroundColor: stateColor }}
          />
        )}
        
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
            className="text-white/[0.06]"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* State Label */}
          <span 
            className="text-xs font-medium tracking-[0.2em] uppercase mb-3 transition-colors duration-500"
            style={{ color: timerStatus !== 'idle' ? stateColor : 'rgba(255,255,255,0.4)' }}
          >
            {getStateLabel()}
          </span>
          
          {/* Time Display */}
          <span className="text-5xl font-extralight tracking-tight text-white font-mono tabular-nums">
            {formatTime(timeRemaining)}
          </span>
          
          {/* Status Indicator */}
          {timerStatus !== 'idle' && (
            <div className="mt-4 flex items-center gap-2">
              <span 
                className={`w-1.5 h-1.5 rounded-full ${timerStatus === 'running' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: timerStatus === 'paused' ? 'rgba(255,255,255,0.4)' : stateColor }}
              />
              <span className="text-xs text-white/40 uppercase tracking-wider">
                {timerStatus === 'paused' ? 'Paused' : timerState === 'focus' ? 'Focusing' : 'Resting'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
