/**
 * Audio file paths - place your audio files in /public/audio/
 * 
 * Required files:
 * - /public/audio/focus-music.mp3  - ADHD-friendly focus music (looping)
 * - /public/audio/break-music.mp3  - Calm lofi/relaxing music (looping)
 * - /public/audio/alarm-start.mp3  - Gentle chime for focus session start
 * - /public/audio/alarm-break.mp3  - Soft bell for break time start
 */

export const AUDIO_PATHS = {
  focusMusic: '/audio/focus-music.mp3',
  breakMusic: '/audio/break-music.mp3',
  alarmStart: '/audio/alarm-start.mp3',
  alarmBreak: '/audio/alarm-break.mp3',
} as const;

// Volume levels (0.0 - 1.0)
export const AUDIO_VOLUMES = {
  music: 1.0,      // Background music - audible at normal device volume
  alarm: 0.6,      // Alarm sounds - noticeable
} as const;

export type AudioKey = keyof typeof AUDIO_PATHS;
