'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { AUDIO_PATHS, AUDIO_VOLUMES } from '@/lib/audio';

interface AudioController {
  playFocusMusic: () => void;
  playBreakMusic: () => void;
  pauseMusic: () => void;      // Pause without resetting position (for timer pause)
  resumeMusic: () => void;     // Resume from paused position (for timer resume)
  stopMusic: () => void;       // Stop and reset to beginning (for session reset)
  playAlarmStart: () => void;
  playAlarmBreak: () => void;
  setMusicEnabled: (enabled: boolean) => void;  // Mute/unmute (volume control only)
  isMusicPlaying: boolean;
  currentMusicType: 'focus' | 'break' | null;
}

export function useAudio(): AudioController {
  // Mute state - controls volume, NOT playback
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusicType, setCurrentMusicType] = useState<'focus' | 'break' | null>(null);
  
  // Audio element refs
  const focusMusicRef = useRef<HTMLAudioElement | null>(null);
  const breakMusicRef = useRef<HTMLAudioElement | null>(null);
  const alarmStartRef = useRef<HTMLAudioElement | null>(null);
  const alarmBreakRef = useRef<HTMLAudioElement | null>(null);
  
  // Track if audio elements are initialized
  const isInitializedRef = useRef(false);

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

  // Pause music without resetting position (for timer pause - actual pause, not mute)
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

  // Stop music and reset to beginning (for session complete or reset)
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

  // Resume music from paused position (for timer resume)
  const resumeMusic = useCallback(() => {
    console.log('[Audio] Resuming music, currentType:', currentMusicType);
    if (!currentMusicType) return;
    
    const audioElement = currentMusicType === 'focus' ? focusMusicRef.current : breakMusicRef.current;
    
    if (audioElement) {
      console.log('[Audio] Resuming', currentMusicType, 'music from position:', audioElement.currentTime);
      const playPromise = audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio] Music resumed successfully');
            setIsMusicPlaying(true);
          })
          .catch((error) => {
            console.log('[Audio] Resume failed:', error.message);
          });
      }
    }
  }, [currentMusicType]);

  // Play focus music - ALWAYS plays, volume is controlled by mute state
  const playFocusMusic = useCallback(() => {
    console.log('[Audio] playFocusMusic called, musicEnabled (mute state):', musicEnabled);
    
    // Stop break music if playing
    if (breakMusicRef.current) {
      breakMusicRef.current.pause();
      breakMusicRef.current.currentTime = 0;
    }
    
    if (focusMusicRef.current) {
      console.log('[Audio] Playing focus music from beginning...');
      focusMusicRef.current.currentTime = 0;
      // Set volume based on current mute state
      focusMusicRef.current.volume = getMusicVolume(musicEnabled);
      
      const playPromise = focusMusicRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio] Focus music started playing (volume:', focusMusicRef.current?.volume, ')');
            setIsMusicPlaying(true);
            setCurrentMusicType('focus');
          })
          .catch((error) => {
            console.log('[Audio] Focus music playback failed:', error.message);
            setCurrentMusicType('focus');
          });
      }
    } else {
      console.log('[Audio] Focus music element not ready');
      setCurrentMusicType('focus');
    }
  }, [musicEnabled, getMusicVolume]);

  // Play break music - ALWAYS plays, volume is controlled by mute state
  const playBreakMusic = useCallback(() => {
    console.log('[Audio] playBreakMusic called, musicEnabled (mute state):', musicEnabled);
    
    // Stop focus music if playing
    if (focusMusicRef.current) {
      focusMusicRef.current.pause();
      focusMusicRef.current.currentTime = 0;
    }
    
    if (breakMusicRef.current) {
      console.log('[Audio] Playing break music from beginning...');
      breakMusicRef.current.currentTime = 0;
      // Set volume based on current mute state
      breakMusicRef.current.volume = getMusicVolume(musicEnabled);
      
      const playPromise = breakMusicRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio] Break music started playing (volume:', breakMusicRef.current?.volume, ')');
            setIsMusicPlaying(true);
            setCurrentMusicType('break');
          })
          .catch((error) => {
            console.log('[Audio] Break music playback failed:', error.message);
            setCurrentMusicType('break');
          });
      }
    } else {
      console.log('[Audio] Break music element not ready');
      setCurrentMusicType('break');
    }
  }, [musicEnabled, getMusicVolume]);

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

  // Mute/Unmute - ONLY changes volume, does NOT stop/start playback
  const setMusicEnabled = useCallback((enabled: boolean) => {
    console.log('[Audio] setMusicEnabled (mute/unmute):', enabled);
    setMusicEnabledState(enabled);
    // Just update the volume - music keeps playing either way
    updateMusicVolume(enabled);
  }, [updateMusicVolume]);

  return {
    playFocusMusic,
    playBreakMusic,
    pauseMusic,
    resumeMusic,
    stopMusic,
    playAlarmStart,
    playAlarmBreak,
    setMusicEnabled,
    isMusicPlaying,
    currentMusicType,
  };
}
