'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
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
  // Use state instead of ref for musicEnabled to trigger re-renders
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Audio element refs
  const focusMusicRef = useRef<HTMLAudioElement | null>(null);
  const breakMusicRef = useRef<HTMLAudioElement | null>(null);
  const alarmStartRef = useRef<HTMLAudioElement | null>(null);
  const alarmBreakRef = useRef<HTMLAudioElement | null>(null);
  
  // Track if audio elements are initialized
  const isInitializedRef = useRef(false);

  // Initialize audio elements on mount
  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return;

    console.log('[Audio] Initializing audio elements...');
    
    // Create audio elements
    focusMusicRef.current = new Audio(AUDIO_PATHS.focusMusic);
    breakMusicRef.current = new Audio(AUDIO_PATHS.breakMusic);
    alarmStartRef.current = new Audio(AUDIO_PATHS.alarmStart);
    alarmBreakRef.current = new Audio(AUDIO_PATHS.alarmBreak);

    // Configure music to loop
    if (focusMusicRef.current) {
      focusMusicRef.current.loop = true;
      focusMusicRef.current.volume = AUDIO_VOLUMES.music;
      focusMusicRef.current.preload = 'auto';
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.loop = true;
      breakMusicRef.current.volume = AUDIO_VOLUMES.music;
      breakMusicRef.current.preload = 'auto';
    }

    // Configure alarm volumes
    if (alarmStartRef.current) {
      alarmStartRef.current.volume = AUDIO_VOLUMES.alarm;
      alarmStartRef.current.preload = 'auto';
    }
    if (alarmBreakRef.current) {
      alarmBreakRef.current.volume = AUDIO_VOLUMES.alarm;
      alarmBreakRef.current.preload = 'auto';
    }

    isInitializedRef.current = true;
    console.log('[Audio] Audio elements initialized successfully');

    // Cleanup on unmount
    return () => {
      console.log('[Audio] Cleaning up audio elements');
      focusMusicRef.current?.pause();
      breakMusicRef.current?.pause();
      focusMusicRef.current = null;
      breakMusicRef.current = null;
      alarmStartRef.current = null;
      alarmBreakRef.current = null;
      isInitializedRef.current = false;
    };
  }, []);

  const stopMusic = useCallback(() => {
    console.log('[Audio] Stopping music');
    if (focusMusicRef.current) {
      focusMusicRef.current.pause();
      focusMusicRef.current.currentTime = 0;
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.pause();
      breakMusicRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
  }, []);

  const playFocusMusic = useCallback(() => {
    console.log('[Audio] playFocusMusic called, musicEnabled:', musicEnabled);
    if (!musicEnabled) {
      console.log('[Audio] Music is disabled, skipping focus music');
      return;
    }
    
    // Stop any currently playing music first
    if (breakMusicRef.current) {
      breakMusicRef.current.pause();
      breakMusicRef.current.currentTime = 0;
    }
    
    if (focusMusicRef.current) {
      console.log('[Audio] Playing focus music...');
      focusMusicRef.current.currentTime = 0;
      const playPromise = focusMusicRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio] Focus music started playing');
            setIsMusicPlaying(true);
          })
          .catch((error) => {
            console.log('[Audio] Focus music playback failed:', error.message);
            // Try to play again after a short delay (browser autoplay policy)
            setTimeout(() => {
              focusMusicRef.current?.play().catch(() => {
                console.log('[Audio] Retry failed - user interaction required');
              });
            }, 100);
          });
      }
    } else {
      console.log('[Audio] Focus music element not ready');
    }
  }, [musicEnabled]);

  const playBreakMusic = useCallback(() => {
    console.log('[Audio] playBreakMusic called, musicEnabled:', musicEnabled);
    if (!musicEnabled) {
      console.log('[Audio] Music is disabled, skipping break music');
      return;
    }
    
    // Stop any currently playing music first
    if (focusMusicRef.current) {
      focusMusicRef.current.pause();
      focusMusicRef.current.currentTime = 0;
    }
    
    if (breakMusicRef.current) {
      console.log('[Audio] Playing break music...');
      breakMusicRef.current.currentTime = 0;
      const playPromise = breakMusicRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio] Break music started playing');
            setIsMusicPlaying(true);
          })
          .catch((error) => {
            console.log('[Audio] Break music playback failed:', error.message);
            setTimeout(() => {
              breakMusicRef.current?.play().catch(() => {
                console.log('[Audio] Retry failed - user interaction required');
              });
            }, 100);
          });
      }
    } else {
      console.log('[Audio] Break music element not ready');
    }
  }, [musicEnabled]);

  const playAlarmStart = useCallback(() => {
    console.log('[Audio] Playing start alarm');
    if (alarmStartRef.current) {
      alarmStartRef.current.currentTime = 0;
      alarmStartRef.current.play().catch((error) => {
        console.log('[Audio] Start alarm playback failed:', error.message);
      });
    }
  }, []);

  const playAlarmBreak = useCallback(() => {
    console.log('[Audio] Playing break alarm');
    if (alarmBreakRef.current) {
      alarmBreakRef.current.currentTime = 0;
      alarmBreakRef.current.play().catch((error) => {
        console.log('[Audio] Break alarm playback failed:', error.message);
      });
    }
  }, []);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    console.log('[Audio] setMusicEnabled:', enabled);
    setMusicEnabledState(enabled);
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
    isMusicPlaying,
  };
}
