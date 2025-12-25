'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerState, TimerStatus, PomodoroTemplate } from '@/types';
import { minutesToSeconds } from '@/lib/utils';
import { useAudio } from './useAudio';

interface UseTimerReturn {
  // State
  timerState: TimerState;
  timerStatus: TimerStatus;
  timeRemaining: number;
  totalTime: number;
  currentTemplate: PomodoroTemplate | null;
  sessionsCompleted: number;
  
  // Settings
  isMusicEnabled: boolean;
  
  // Actions
  selectTemplate: (template: PomodoroTemplate) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  toggleMusic: () => void;
  setCustomDurations: (focus: number, breakDuration: number) => void;
}

export function useTimer(): UseTimerReturn {
  // Core timer state
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState<PomodoroTemplate | null>(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Settings
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  
  // Refs for interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to prevent double handling of completion
  const isTransitioningRef = useRef(false);

  // Audio controller
  const audio = useAudio();

  // Clear interval helper
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle timer completion and state transitions
  const handleTimerComplete = useCallback((completedState: TimerState, template: PomodoroTemplate | null, musicEnabled: boolean) => {
    // Prevent double triggering
    if (isTransitioningRef.current) {
      console.log('[Timer] Already transitioning, skipping');
      return;
    }
    isTransitioningRef.current = true;

    console.log('[Timer] Timer complete, completed state:', completedState, 'musicEnabled:', musicEnabled);

    if (completedState === 'focus') {
      // Focus completed -> Start break
      audio.stopMusic();
      
      console.log('[Timer] Focus completed, starting break');
      setSessionsCompleted(prev => prev + 1);
      
      const breakTime = minutesToSeconds(template?.breakDuration || 5);
      console.log('[Timer] Break duration:', breakTime, 'seconds');
      
      // Set break state
      setTimerState('break');
      setTimeRemaining(breakTime);
      setTotalTime(breakTime);
      
      // Play break alarm and start break music (always plays, volume controlled by mute state)
      audio.playAlarmBreak();
      setTimeout(() => {
        audio.playBreakMusic();
      }, 100);
      
      // Allow next transition after state is set
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 200);
      
    } else if (completedState === 'break') {
      // Break completed -> Start new focus
      audio.stopMusic();
      
      console.log('[Timer] Break completed, starting focus');
      
      const focusTime = minutesToSeconds(template?.focusDuration || 25);
      console.log('[Timer] Focus duration:', focusTime, 'seconds');
      
      // Set focus state
      setTimerState('focus');
      setTimeRemaining(focusTime);
      setTotalTime(focusTime);
      
      // Play focus alarm and start focus music (always plays, volume controlled by mute state)
      audio.playAlarmStart();
      setTimeout(() => {
        audio.playFocusMusic();
      }, 100);
      
      // Allow next transition after state is set
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 200);
    }
  }, [audio]);

  // Timer tick effect - separate from completion handling
  useEffect(() => {
    // Only run interval when status is 'running'
    if (timerStatus !== 'running') {
      return;
    }

    console.log('[Timer] Starting interval, timeRemaining:', timeRemaining, 'timerState:', timerState);

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        // Don't decrement if we're in a transition
        if (isTransitioningRef.current) {
          return prev;
        }
        
        if (prev <= 1) {
          // Timer completed - clear interval first
          clearTimerInterval();
          // Return 0, and let the completion effect handle the transition
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimerInterval();
    };
  }, [timerStatus, timerState, clearTimerInterval]); // Include timerState to recreate interval on state transitions (focus <-> break)

  // Separate effect to handle timer completion when timeRemaining hits 0
  useEffect(() => {
    if (timeRemaining === 0 && timerStatus === 'running' && timerState !== 'idle') {
      console.log('[Timer] Time reached 0, handling completion for state:', timerState);
      handleTimerComplete(timerState, currentTemplate, isMusicEnabled);
    }
  }, [timeRemaining, timerStatus, timerState, currentTemplate, isMusicEnabled, handleTimerComplete]);

  // Sync music enabled state with audio controller
  useEffect(() => {
    audio.setMusicEnabled(isMusicEnabled);
  }, [isMusicEnabled, audio]);

  // Select a template
  const selectTemplate = useCallback((template: PomodoroTemplate) => {
    clearTimerInterval();
    isTransitioningRef.current = false;
    setCurrentTemplate(template);
    const focusTime = minutesToSeconds(template.focusDuration);
    setTimeRemaining(focusTime);
    setTotalTime(focusTime);
    setTimerState('idle');
    setTimerStatus('idle');
    audio.stopMusic();
  }, [clearTimerInterval, audio]);

  // Start the timer
  const startTimer = useCallback(() => {
    if (!currentTemplate) return;
    
    console.log('[Timer] Starting timer, music enabled:', isMusicEnabled);
    isTransitioningRef.current = false;
    
    const focusTime = minutesToSeconds(currentTemplate.focusDuration);
    setTimerState('focus');
    setTimeRemaining(focusTime);
    setTotalTime(focusTime);
    setTimerStatus('running');
    
    // Play start alarm
    audio.playAlarmStart();
    
    // Play focus music from beginning (always plays, volume controlled by mute state)
    setTimeout(() => {
      console.log('[Timer] Playing focus music after delay');
      audio.playFocusMusic();
    }, 150);
  }, [currentTemplate, audio]);

  // Pause the timer - just pause music, don't reset
  const pauseTimer = useCallback(() => {
    console.log('[Timer] Pausing timer');
    clearTimerInterval();
    setTimerStatus('paused');
    audio.pauseMusic();
  }, [clearTimerInterval, audio]);

  // Resume the timer - resume music from where it was paused
  const resumeTimer = useCallback(() => {
    console.log('[Timer] Resuming timer');
    setTimerStatus('running');
    
    // Always resume music (volume controlled by mute state)
    setTimeout(() => {
      audio.resumeMusic();
    }, 100);
  }, [audio]);

  // Reset the timer - full stop and reset music
  const resetTimer = useCallback(() => {
    console.log('[Timer] Resetting timer');
    clearTimerInterval();
    isTransitioningRef.current = false;
    audio.stopMusic();
    
    if (currentTemplate) {
      const focusTime = minutesToSeconds(currentTemplate.focusDuration);
      setTimeRemaining(focusTime);
      setTotalTime(focusTime);
    }
    
    setTimerState('idle');
    setTimerStatus('idle');
  }, [clearTimerInterval, currentTemplate, audio]);

  // Toggle music (mute/unmute)
  const toggleMusic = useCallback(() => {
    setIsMusicEnabled(prev => {
      const newValue = !prev;
      console.log('[Timer] Toggle music:', newValue);
      // The audio.setMusicEnabled will handle resuming music automatically via the useEffect sync
      return newValue;
    });
  }, []);

  // Set custom durations
  const setCustomDurations = useCallback((focus: number, breakDuration: number) => {
    const customTemplate: PomodoroTemplate = {
      id: 'custom',
      name: 'Custom',
      focusDuration: focus,
      breakDuration: breakDuration,
      description: 'Your custom settings',
    };
    selectTemplate(customTemplate);
  }, [selectTemplate]);

  return {
    timerState,
    timerStatus,
    timeRemaining,
    totalTime,
    currentTemplate,
    sessionsCompleted,
    isMusicEnabled,
    selectTemplate,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    toggleMusic,
    setCustomDurations,
  };
}
