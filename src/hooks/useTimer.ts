'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
  
  // Refs to track current state in callbacks (to avoid stale closures)
  const timerStateRef = useRef(timerState);
  const currentTemplateRef = useRef(currentTemplate);
  const isMusicEnabledRef = useRef(isMusicEnabled);
  
  // Keep refs in sync with state
  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);
  
  useEffect(() => {
    currentTemplateRef.current = currentTemplate;
  }, [currentTemplate]);
  
  useEffect(() => {
    isMusicEnabledRef.current = isMusicEnabled;
  }, [isMusicEnabled]);

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
  const handleTimerComplete = useCallback(() => {
    clearTimerInterval();
    
    const currentState = timerStateRef.current;
    const template = currentTemplateRef.current;
    const musicEnabled = isMusicEnabledRef.current;

    console.log('[Timer] Timer complete, current state:', currentState, 'musicEnabled:', musicEnabled);

    if (currentState === 'focus') {
      // Focus completed -> Start break
      console.log('[Timer] Focus completed, starting break');
      setSessionsCompleted(prev => prev + 1);
      const breakTime = minutesToSeconds(template?.breakDuration || 5);
      setTimerState('break');
      setTimeRemaining(breakTime);
      setTotalTime(breakTime);
      setTimerStatus('running');
      
      // Play break alarm and music
      audio.playAlarmBreak();
      if (musicEnabled) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          audio.playBreakMusic();
        }, 100);
      }
    } else if (currentState === 'break') {
      // Break completed -> Start new focus
      console.log('[Timer] Break completed, starting focus');
      const focusTime = minutesToSeconds(template?.focusDuration || 25);
      setTimerState('focus');
      setTimeRemaining(focusTime);
      setTotalTime(focusTime);
      setTimerStatus('running');
      
      // Play focus alarm and music  
      audio.playAlarmStart();
      if (musicEnabled) {
        setTimeout(() => {
          audio.playFocusMusic();
        }, 100);
      }
    }
  }, [clearTimerInterval, audio]);

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

  // Sync music enabled state with audio controller
  useEffect(() => {
    audio.setMusicEnabled(isMusicEnabled);
  }, [isMusicEnabled, audio]);

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
    
    console.log('[Timer] Starting timer, music enabled:', isMusicEnabled);
    
    const focusTime = minutesToSeconds(currentTemplate.focusDuration);
    setTimerState('focus');
    setTimeRemaining(focusTime);
    setTotalTime(focusTime);
    setTimerStatus('running');
    
    // Play start alarm
    audio.playAlarmStart();
    
    // Play focus music with small delay to ensure button click is processed
    if (isMusicEnabled) {
      setTimeout(() => {
        console.log('[Timer] Playing focus music after delay');
        audio.playFocusMusic();
      }, 150);
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
      // Use ref for current state to avoid stale closure
      const currentState = timerStateRef.current;
      setTimeout(() => {
        if (currentState === 'focus') {
          audio.playFocusMusic();
        } else if (currentState === 'break') {
          audio.playBreakMusic();
        }
      }, 100);
    }
  }, [isMusicEnabled, audio]);

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
    setIsMusicEnabled(prev => {
      const newValue = !prev;
      console.log('[Timer] Toggle music:', newValue);
      
      // If turning music ON while timer is running, start playing
      if (newValue && timerStatus === 'running') {
        const currentState = timerStateRef.current;
        setTimeout(() => {
          if (currentState === 'focus') {
            audio.playFocusMusic();
          } else if (currentState === 'break') {
            audio.playBreakMusic();
          }
        }, 100);
      }
      
      return newValue;
    });
  }, [timerStatus, audio]);

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
