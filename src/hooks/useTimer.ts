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
  
  // Refs for interval and audio
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audio = useAudio();

  // Clear interval helper
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle timer completion and state transitions
  const handleTimerComplete = useCallback(() => {
    clearTimerInterval();

    if (timerState === 'focus') {
      // Focus completed -> Start break
      setSessionsCompleted(prev => prev + 1);
      const breakTime = minutesToSeconds(currentTemplate?.breakDuration || 5);
      setTimerState('break');
      setTimeRemaining(breakTime);
      setTotalTime(breakTime);
      setTimerStatus('running');
      
      // Play break alarm and music
      audio.playAlarmBreak();
      if (isMusicEnabled) {
        audio.playBreakMusic();
      }
    } else if (timerState === 'break') {
      // Break completed -> Start new focus
      const focusTime = minutesToSeconds(currentTemplate?.focusDuration || 25);
      setTimerState('focus');
      setTimeRemaining(focusTime);
      setTotalTime(focusTime);
      setTimerStatus('running');
      
      // Play focus alarm and music
      audio.playAlarmStart();
      if (isMusicEnabled) {
        audio.playFocusMusic();
      }
    }
  }, [timerState, currentTemplate, isMusicEnabled, audio, clearTimerInterval]);

  // Timer tick effect
  useEffect(() => {
    if (timerStatus === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimerInterval();
  }, [timerStatus, handleTimerComplete, clearTimerInterval]);

  // Update audio music enabled state
  useEffect(() => {
    audio.setMusicEnabled(isMusicEnabled);
    
    // If music is re-enabled during a session, start playing
    if (isMusicEnabled && timerStatus === 'running') {
      if (timerState === 'focus') {
        audio.playFocusMusic();
      } else if (timerState === 'break') {
        audio.playBreakMusic();
      }
    }
  }, [isMusicEnabled, timerStatus, timerState, audio]);

  // Select a template
  const selectTemplate = useCallback((template: PomodoroTemplate) => {
    clearTimerInterval();
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
    
    const focusTime = minutesToSeconds(currentTemplate.focusDuration);
    setTimerState('focus');
    setTimeRemaining(focusTime);
    setTotalTime(focusTime);
    setTimerStatus('running');
    
    // Play start alarm and focus music
    audio.playAlarmStart();
    if (isMusicEnabled) {
      audio.playFocusMusic();
    }
  }, [currentTemplate, isMusicEnabled, audio]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    clearTimerInterval();
    setTimerStatus('paused');
    audio.stopMusic();
  }, [clearTimerInterval, audio]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    setTimerStatus('running');
    
    if (isMusicEnabled) {
      if (timerState === 'focus') {
        audio.playFocusMusic();
      } else if (timerState === 'break') {
        audio.playBreakMusic();
      }
    }
  }, [timerState, isMusicEnabled, audio]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    clearTimerInterval();
    audio.stopMusic();
    
    if (currentTemplate) {
      const focusTime = minutesToSeconds(currentTemplate.focusDuration);
      setTimeRemaining(focusTime);
      setTotalTime(focusTime);
    }
    
    setTimerState('idle');
    setTimerStatus('idle');
  }, [clearTimerInterval, currentTemplate, audio]);

  // Toggle music
  const toggleMusic = useCallback(() => {
    setIsMusicEnabled(prev => !prev);
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
