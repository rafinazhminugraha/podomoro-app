// Timer state types
export type TimerState = 'idle' | 'focus' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused';

// Pomodoro template type
export interface PomodoroTemplate {
  id: string;
  name: string;
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  description: string;
}

// Timer context type
export interface TimerContextType {
  // State
  timerState: TimerState;
  timerStatus: TimerStatus;
  timeRemaining: number; // in seconds
  currentTemplate: PomodoroTemplate | null;
  sessionsCompleted: number;
  
  // Settings
  isMusicEnabled: boolean;
  isAlarmEnabled: boolean;
  
  // Actions
  selectTemplate: (template: PomodoroTemplate) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  toggleMusic: () => void;
  toggleAlarm: () => void;
  setCustomDurations: (focus: number, breakDuration: number) => void;
}

// Audio types
export type AudioType = 'focus' | 'break' | 'alarm-start' | 'alarm-break';
