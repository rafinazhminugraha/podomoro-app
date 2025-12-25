/**
 * Format seconds into MM:SS display format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate progress percentage (0-100)
 */
export function calculateProgress(remaining: number, total: number): number {
  if (total === 0) return 0;
  return ((total - remaining) / total) * 100;
}

/**
 * Convert minutes to seconds
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * Get gradient class based on timer state
 */
export function getStateGradient(state: 'idle' | 'focus' | 'break'): string {
  switch (state) {
    case 'focus':
      return 'from-rose-500/20 via-amber-500/10 to-transparent';
    case 'break':
      return 'from-emerald-500/20 via-teal-500/10 to-transparent';
    default:
      return 'from-slate-500/10 via-slate-400/5 to-transparent';
  }
}

/**
 * Get accent color based on timer state
 */
export function getStateColor(state: 'idle' | 'focus' | 'break'): string {
  switch (state) {
    case 'focus':
      return '#f43f5e'; // Rose
    case 'break':
      return '#10b981'; // Emerald
    default:
      return '#64748b'; // Slate
  }
}
