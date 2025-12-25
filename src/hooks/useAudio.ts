'use client';

import { useRef, useCallback, useEffect } from 'react';
import { AUDIO_PATHS, AUDIO_VOLUMES } from '@/lib/audio';

interface AudioController {
  playFocusMusic: () => void;
  playBreakMusic: () => void;
  stopMusic: () => void;
  playAlarmStart: () => void;
  playAlarmBreak: () => void;
  setMusicEnabled: (enabled: boolean) => void;
  isMusicPlaying: boolean;
}

export function useAudio(): AudioController {
  const focusMusicRef = useRef<HTMLAudioElement | null>(null);
  const breakMusicRef = useRef<HTMLAudioElement | null>(null);
  const alarmStartRef = useRef<HTMLAudioElement | null>(null);
  const alarmBreakRef = useRef<HTMLAudioElement | null>(null);
  const isMusicPlayingRef = useRef(false);
  const musicEnabledRef = useRef(true);

  // Initialize audio elements on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create audio elements
    focusMusicRef.current = new Audio(AUDIO_PATHS.focusMusic);
    breakMusicRef.current = new Audio(AUDIO_PATHS.breakMusic);
    alarmStartRef.current = new Audio(AUDIO_PATHS.alarmStart);
    alarmBreakRef.current = new Audio(AUDIO_PATHS.alarmBreak);

    // Configure music to loop
    if (focusMusicRef.current) {
      focusMusicRef.current.loop = true;
      focusMusicRef.current.volume = AUDIO_VOLUMES.music;
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.loop = true;
      breakMusicRef.current.volume = AUDIO_VOLUMES.music;
    }

    // Configure alarm volumes
    if (alarmStartRef.current) {
      alarmStartRef.current.volume = AUDIO_VOLUMES.alarm;
    }
    if (alarmBreakRef.current) {
      alarmBreakRef.current.volume = AUDIO_VOLUMES.alarm;
    }

    // Cleanup on unmount
    return () => {
      focusMusicRef.current?.pause();
      breakMusicRef.current?.pause();
      focusMusicRef.current = null;
      breakMusicRef.current = null;
      alarmStartRef.current = null;
      alarmBreakRef.current = null;
    };
  }, []);

  const stopMusic = useCallback(() => {
    focusMusicRef.current?.pause();
    breakMusicRef.current?.pause();
    if (focusMusicRef.current) focusMusicRef.current.currentTime = 0;
    if (breakMusicRef.current) breakMusicRef.current.currentTime = 0;
    isMusicPlayingRef.current = false;
  }, []);

  const playFocusMusic = useCallback(() => {
    if (!musicEnabledRef.current) return;
    stopMusic();
    focusMusicRef.current?.play().catch(() => {
      // Audio play failed - likely user hasn't interacted with page yet
      console.log('Focus music playback requires user interaction');
    });
    isMusicPlayingRef.current = true;
  }, [stopMusic]);

  const playBreakMusic = useCallback(() => {
    if (!musicEnabledRef.current) return;
    stopMusic();
    breakMusicRef.current?.play().catch(() => {
      console.log('Break music playback requires user interaction');
    });
    isMusicPlayingRef.current = true;
  }, [stopMusic]);

  const playAlarmStart = useCallback(() => {
    // Alarms always play regardless of music setting
    if (alarmStartRef.current) {
      alarmStartRef.current.currentTime = 0;
      alarmStartRef.current.play().catch(() => {
        console.log('Alarm playback requires user interaction');
      });
    }
  }, []);

  const playAlarmBreak = useCallback(() => {
    // Alarms always play regardless of music setting
    if (alarmBreakRef.current) {
      alarmBreakRef.current.currentTime = 0;
      alarmBreakRef.current.play().catch(() => {
        console.log('Alarm playback requires user interaction');
      });
    }
  }, []);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    musicEnabledRef.current = enabled;
    if (!enabled) {
      stopMusic();
    }
  }, [stopMusic]);

  return {
    playFocusMusic,
    playBreakMusic,
    stopMusic,
    playAlarmStart,
    playAlarmBreak,
    setMusicEnabled,
    isMusicPlaying: isMusicPlayingRef.current,
  };
}
