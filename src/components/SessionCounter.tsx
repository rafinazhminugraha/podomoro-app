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
      <div className="flex flex-col items-center text-center">
        <span className="text-[10px] sm:text-xs text-white/30 tracking-wide">
          No sessions yet
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {/* Session Dots */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {dots.map((_, index) => (
          <div
            key={index}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/40"
          />
        ))}
        {overflow > 0 && (
          <span className="text-[10px] sm:text-xs text-white/40 ml-1">+{overflow}</span>
        )}
      </div>

      {/* Session Count Text */}
      <div className="text-center">
        <span className="text-[10px] sm:text-xs text-white/40">
          {sessionsCompleted} {sessionsCompleted === 1 ? 'session' : 'sessions'}
        </span>
      </div>
    </div>
  );
}
