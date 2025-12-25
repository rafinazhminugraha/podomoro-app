'use client';

import { useAudioContext } from '@/contexts/AudioContext';

// Re-export the hook from context to maintain backward compatibility
export function useAudio() {
  return useAudioContext();
}

// Also export the type for compatibility
export type { AudioContextValue as AudioController } from '@/contexts/AudioContext';
