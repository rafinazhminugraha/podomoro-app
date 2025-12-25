'use client';

interface SessionCounterProps {
  sessionsCompleted: number;
}

export function SessionCounter({ sessionsCompleted }: SessionCounterProps) {
  // Generate array for session dots (show up to 8 dots)
  const maxDots = 8;
  const dots = Array.from({ length: Math.min(sessionsCompleted, maxDots) });
  const overflow = sessionsCompleted > maxDots ? sessionsCompleted - maxDots : 0;

  if (sessionsCompleted === 0) {
    return (
      <div className="flex flex-col items-center text-center text-white/40">
        <span className="text-sm">No sessions completed yet</span>
        <span className="text-xs mt-1">Start your first focus session!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Session Dots */}
      <div className="flex items-center gap-2 mb-2">
        {dots.map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/30"
            style={{
              animation: `pulseGlow 2s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
        {overflow > 0 && (
          <span className="text-sm text-white/60 ml-1">+{overflow}</span>
        )}
      </div>

      {/* Session Count Text */}
      <div className="text-center">
        <span className="text-lg font-medium text-white/90">
          {sessionsCompleted}
        </span>
        <span className="text-sm text-white/50 ml-1">
          {sessionsCompleted === 1 ? 'session' : 'sessions'} completed today
        </span>
      </div>

      {/* Motivational message based on session count */}
      <span className="text-xs text-white/40 mt-1">
        {getMotivationalMessage(sessionsCompleted)}
      </span>
    </div>
  );
}

function getMotivationalMessage(sessions: number): string {
  if (sessions === 1) return '🌱 Great start!';
  if (sessions === 2) return '💪 Building momentum!';
  if (sessions === 3) return '🔥 You\'re on fire!';
  if (sessions === 4) return '⭐ Excellent focus!';
  if (sessions <= 6) return '🚀 Crushing it!';
  if (sessions <= 8) return '🏆 Champion level!';
  return '🎯 Legendary focus!';
}
