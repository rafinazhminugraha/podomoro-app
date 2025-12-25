'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { AUDIO_PATHS, AUDIO_VOLUMES } from '@/lib/audio';

// Detect if we're on iOS
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export interface AudioContextValue {
  playFocusMusic: () => void;
  playBreakMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  stopMusic: () => void;
  playAlarmStart: () => void;
  playAlarmBreak: () => void;
  setMusicEnabled: (enabled: boolean) => void;
  unlockAudio: () => Promise<void>;
  isMusicPlaying: boolean;
  currentMusicType: 'focus' | 'break' | null;
  isAudioUnlocked: boolean;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Mute state - controls volume, NOT playback
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusicType, setCurrentMusicType] = useState<'focus' | 'break' | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  
  // Audio element refs
  const focusMusicRef = useRef<HTMLAudioElement | null>(null);
  const breakMusicRef = useRef<HTMLAudioElement | null>(null);
  const alarmStartRef = useRef<HTMLAudioElement | null>(null);
  const alarmBreakRef = useRef<HTMLAudioElement | null>(null);
  
  // Track if audio elements are initialized
  const isInitializedRef = useRef(false);
  const isUnlockingRef = useRef(false);
  const unlockPromiseRef = useRef<Promise<void> | null>(null);

  // Helper to get the correct volume based on mute state
  const getMusicVolume = useCallback((enabled: boolean) => {
    return enabled ? AUDIO_VOLUMES.music : 0;
  }, []);

  // Update volume on all music elements when mute state changes
  const updateMusicVolume = useCallback((enabled: boolean) => {
    const volume = getMusicVolume(enabled);
    console.log('[Audio] Updating music volume to:', volume);
    
    if (focusMusicRef.current) {
      focusMusicRef.current.volume = volume;
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.volume = volume;
    }
  }, [getMusicVolume]);

  // Helper to create audio element with proper iOS attributes
  const createAudioElement = useCallback((src: string, loop: boolean = false): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.loop = loop;
    
    // iOS-specific attributes
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    
    // iOS needs this for better audio handling
    if (isIOS()) {
      audio.load();
    }
    
    return audio;
  }, []);

  // Unlock audio for iOS - must be called from a user gesture (tap/click)
  const unlockAudio = useCallback((): Promise<void> => {
    // Return existing promise if already unlocking
    if (unlockPromiseRef.current) {
      return unlockPromiseRef.current;
    }
    
    // Already unlocked
    if (isAudioUnlocked) {
      console.log('[Audio] Already unlocked');
      return Promise.resolve();
    }
    
    if (isUnlockingRef.current) {
      console.log('[Audio] Already unlocking');
      return Promise.resolve();
    }
    
    isUnlockingRef.current = true;
    console.log('[Audio] Unlocking audio for iOS...');
    
    const unlockElement = async (element: HTMLAudioElement | null, name: string): Promise<void> => {
      if (!element) {
        console.log(`[Audio] ${name} element is null, skipping`);
        return;
      }
      
      try {
        // Store current state
        const originalVolume = element.volume;
        const originalMuted = element.muted;
        
        // Set to silent
        element.volume = 0;
        element.muted = true;
        
        // iOS requires the audio to be loaded
        if (element.readyState < 2) {
          element.load();
          // Wait for it to be ready
          await new Promise<void>((resolve) => {
            const timeout = setTimeout(() => {
              resolve();
            }, 1000);
            
            const handleCanPlay = () => {
              clearTimeout(timeout);
              element.removeEventListener('canplaythrough', handleCanPlay);
              element.removeEventListener('error', handleError);
              resolve();
            };
            
            const handleError = () => {
              clearTimeout(timeout);
              element.removeEventListener('canplaythrough', handleCanPlay);
              element.removeEventListener('error', handleError);
              resolve();
            };
            
            element.addEventListener('canplaythrough', handleCanPlay);
            element.addEventListener('error', handleError);
          });
        }
        
        // Play briefly then pause - this unlocks the element on iOS
        const playPromise = element.play();
        
        if (playPromise !== undefined) {
          await playPromise;
        }
        
        // Immediately pause
        element.pause();
        element.currentTime = 0;
        
        // Restore original state
        element.volume = originalVolume;
        element.muted = originalMuted;
        
        console.log(`[Audio] ${name} unlocked successfully`);
      } catch (error) {
        console.log(`[Audio] ${name} unlock attempt:`, error);
      }
    };
    
    // Create and store the promise
    unlockPromiseRef.current = Promise.all([
      unlockElement(focusMusicRef.current, 'Focus music'),
      unlockElement(breakMusicRef.current, 'Break music'),
      unlockElement(alarmStartRef.current, 'Start alarm'),
      unlockElement(alarmBreakRef.current, 'Break alarm'),
    ]).then(() => {
      console.log('[Audio] All audio elements unlocked for iOS');
      setIsAudioUnlocked(true);
      isUnlockingRef.current = false;
      unlockPromiseRef.current = null;
    }).catch((error) => {
      console.log('[Audio] Some unlock operations failed:', error);
      setIsAudioUnlocked(true);
      isUnlockingRef.current = false;
      unlockPromiseRef.current = null;
    });
    
    return unlockPromiseRef.current;
  }, [isAudioUnlocked]);

  // Initialize audio elements on mount
  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return;

    console.log('[Audio] Initializing audio elements...');
    console.log('[Audio] Is iOS device:', isIOS());
    
    // Create audio elements with proper iOS support
    focusMusicRef.current = createAudioElement(AUDIO_PATHS.focusMusic, true);
    breakMusicRef.current = createAudioElement(AUDIO_PATHS.breakMusic, true);
    alarmStartRef.current = createAudioElement(AUDIO_PATHS.alarmStart, false);
    alarmBreakRef.current = createAudioElement(AUDIO_PATHS.alarmBreak, false);

    // Set initial volumes
    if (focusMusicRef.current) {
      focusMusicRef.current.volume = AUDIO_VOLUMES.music;
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.volume = AUDIO_VOLUMES.music;
    }
    if (alarmStartRef.current) {
      alarmStartRef.current.volume = AUDIO_VOLUMES.alarm;
    }
    if (alarmBreakRef.current) {
      alarmBreakRef.current.volume = AUDIO_VOLUMES.alarm;
    }

    isInitializedRef.current = true;
    console.log('[Audio] Audio elements initialized successfully');

    // For non-iOS devices, consider audio already unlocked
    if (!isIOS()) {
      setIsAudioUnlocked(true);
    }

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
  }, [createAudioElement]);

  // Auto-unlock on first interaction for iOS
  useEffect(() => {
    if (typeof window === 'undefined' || !isIOS()) return;
    
    let hasTriedUnlock = false;

    const handleFirstInteraction = () => {
      if (hasTriedUnlock || isAudioUnlocked) return;
      hasTriedUnlock = true;

      console.log('[Audio] First user interaction detected, unlocking audio...');
      unlockAudio();

      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('touchend', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    document.addEventListener('touchend', handleFirstInteraction, { passive: true });
    document.addEventListener('click', handleFirstInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('touchend', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [isAudioUnlocked, unlockAudio]);

  // Safe play function that handles iOS promise rejection
  const safePlay = useCallback(async (element: HTMLAudioElement | null, name: string): Promise<boolean> => {
    if (!element) {
      console.log(`[Audio] ${name} element not ready`);
      return false;
    }

    try {
      // For iOS, make sure we reload if needed
      if (isIOS() && element.readyState < 2) {
        element.load();
      }

      const playPromise = element.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`[Audio] ${name} started playing`);
        return true;
      }
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`[Audio] ${name} playback failed:`, errorMessage);
      return false;
    }
  }, []);

  // Pause music without resetting position
  const pauseMusic = useCallback(() => {
    console.log('[Audio] Pausing music (keeping position)');
    if (focusMusicRef.current) {
      focusMusicRef.current.pause();
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.pause();
    }
    setIsMusicPlaying(false);
  }, []);

  // Stop music and reset to beginning
  const stopMusic = useCallback(() => {
    console.log('[Audio] Stopping music (resetting position)');
    if (focusMusicRef.current) {
      focusMusicRef.current.pause();
      focusMusicRef.current.currentTime = 0;
    }
    if (breakMusicRef.current) {
      breakMusicRef.current.pause();
      breakMusicRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
    setCurrentMusicType(null);
  }, []);

  // Resume music from paused position
  const resumeMusic = useCallback(async () => {
    console.log('[Audio] Resuming music, currentType:', currentMusicType);
    if (!currentMusicType) return;
    
    const audioElement = currentMusicType === 'focus' ? focusMusicRef.current : breakMusicRef.current;
    
    if (audioElement) {
      console.log('[Audio] Resuming', currentMusicType, 'music from position:', audioElement.currentTime);
      const success = await safePlay(audioElement, `${currentMusicType} music`);
      if (success) {
        setIsMusicPlaying(true);
      }
    }
  }, [currentMusicType, safePlay]);

  // Play focus music
  const playFocusMusic = useCallback(async () => {
    console.log('[Audio] playFocusMusic called, musicEnabled (mute state):', musicEnabled);
    
    if (breakMusicRef.current) {
      breakMusicRef.current.pause();
      breakMusicRef.current.currentTime = 0;
    }
    
    if (focusMusicRef.current) {
      console.log('[Audio] Playing focus music from beginning...');
      focusMusicRef.current.currentTime = 0;
      focusMusicRef.current.volume = getMusicVolume(musicEnabled);
      
      const success = await safePlay(focusMusicRef.current, 'Focus music');
      
      if (success) {
        console.log('[Audio] Focus music started playing (volume:', focusMusicRef.current?.volume, ')');
        setIsMusicPlaying(true);
      }
      setCurrentMusicType('focus');
    } else {
      console.log('[Audio] Focus music element not ready');
      setCurrentMusicType('focus');
    }
  }, [musicEnabled, getMusicVolume, safePlay]);

  // Play break music
  const playBreakMusic = useCallback(async () => {
    console.log('[Audio] playBreakMusic called, musicEnabled (mute state):', musicEnabled);
    
    if (focusMusicRef.current) {
      focusMusicRef.current.pause();
      focusMusicRef.current.currentTime = 0;
    }
    
    if (breakMusicRef.current) {
      console.log('[Audio] Playing break music from beginning...');
      breakMusicRef.current.currentTime = 0;
      breakMusicRef.current.volume = getMusicVolume(musicEnabled);
      
      const success = await safePlay(breakMusicRef.current, 'Break music');
      
      if (success) {
        console.log('[Audio] Break music started playing (volume:', breakMusicRef.current?.volume, ')');
        setIsMusicPlaying(true);
      }
      setCurrentMusicType('break');
    } else {
      console.log('[Audio] Break music element not ready');
      setCurrentMusicType('break');
    }
  }, [musicEnabled, getMusicVolume, safePlay]);

  const playAlarmStart = useCallback(async () => {
    console.log('[Audio] Playing start alarm');
    if (alarmStartRef.current) {
      alarmStartRef.current.currentTime = 0;
      await safePlay(alarmStartRef.current, 'Start alarm');
    }
  }, [safePlay]);

  const playAlarmBreak = useCallback(async () => {
    console.log('[Audio] Playing break alarm');
    if (alarmBreakRef.current) {
      alarmBreakRef.current.currentTime = 0;
      await safePlay(alarmBreakRef.current, 'Break alarm');
    }
  }, [safePlay]);

  // Mute/Unmute
  const setMusicEnabled = useCallback((enabled: boolean) => {
    console.log('[Audio] setMusicEnabled (mute/unmute):', enabled);
    setMusicEnabledState(enabled);
    updateMusicVolume(enabled);
  }, [updateMusicVolume]);

  const value: AudioContextValue = {
    playFocusMusic,
    playBreakMusic,
    pauseMusic,
    resumeMusic,
    stopMusic,
    playAlarmStart,
    playAlarmBreak,
    setMusicEnabled,
    unlockAudio,
    isMusicPlaying,
    currentMusicType,
    isAudioUnlocked,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// Hook to use the audio context
export function useAudioContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}
