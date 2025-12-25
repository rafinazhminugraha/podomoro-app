'use client';

import { useTimer } from '@/hooks';
import {
  TimerDisplay,
  TimerControls,
  ModeSelector,
  SessionCounter,
  SettingsPanel,
  NowPlayingCard,
} from '@/components';

// Motivational messages based on sessions completed
const getMotivationalMessage = (sessions: number): { title: string; subtitle: string } => {
  if (sessions === 0) {
    return { title: 'Ready to Focus', subtitle: 'Start your first session' };
  } else if (sessions === 1) {
    return { title: 'Great Start', subtitle: 'First session complete' };
  } else if (sessions === 2) {
    return { title: 'Building Momentum', subtitle: 'Keep the flow going' };
  } else if (sessions === 3) {
    return { title: 'On Fire', subtitle: 'You\'re doing amazing' };
  } else if (sessions === 4) {
    return { title: 'Unstoppable', subtitle: 'Peak productivity achieved' };
  } else {
    return { title: 'Flow Master', subtitle: `${sessions} sessions of pure focus` };
  }
};

export default function HomePage() {
  const {
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
  } = useTimer();

  const isTimerActive = timerStatus !== 'idle';
  const motivation = getMotivationalMessage(sessionsCompleted);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Symmetric Gradient Orbs - Horizontally Aligned */}
      <div 
        className={`
          fixed left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
          w-150 h-150 rounded-full
          blur-[120px] pointer-events-none
          transition-all duration-1000 ease-out
          ${timerState === 'focus' ? 'bg-rose-500/20' : 
            timerState === 'break' ? 'bg-emerald-500/20' : 'bg-white/15'}
        `}
      />
      <div 
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/2
          w-150 h-150 rounded-full
          blur-[120px] pointer-events-none
          transition-all duration-1000 ease-out
          ${timerState === 'focus' ? 'bg-rose-500/20' : 
            timerState === 'break' ? 'bg-emerald-500/20' : 'bg-white/15'}
        `}
      />

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Top - Motivational Message */}
      <div className="fixed top-16 left-0 right-0 flex flex-col items-center z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white tracking-wide transition-all duration-500">
          {motivation.title}
        </h1>
        <p className="mt-2 text-sm text-white/40 tracking-wider">
          {motivation.subtitle}
        </p>
      </div>

      {/* Timer - Always Centered */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="flex flex-col items-center pointer-events-auto">
          <TimerDisplay
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            timerState={timerState}
            timerStatus={timerStatus}
          />
        </div>
      </div>

      {/* Bottom - Session Counter */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <SessionCounter sessionsCompleted={sessionsCompleted} />
      </div>

      {/* Left Panel - Mode Selector (Fixed Position) */}
      <aside 
        className={`
          fixed left-40 top-1/2 -translate-y-1/2 z-20
          transition-all duration-500
          ${isTimerActive ? 'opacity-30 pointer-events-none' : 'opacity-100'}
        `}
      >
        <ModeSelector
          selectedTemplate={currentTemplate}
          onSelectTemplate={selectTemplate}
          onCustomDurations={setCustomDurations}
          disabled={isTimerActive}
        />
      </aside>

      {/* Right Panel - Controls (Fixed Position) */}
      <aside className="fixed right-40 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col gap-4">
          <TimerControls
            timerStatus={timerStatus}
            timerState={timerState}
            hasTemplate={currentTemplate !== null}
            onStart={startTimer}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onReset={resetTimer}
          />
          <SettingsPanel
            isMusicEnabled={isMusicEnabled}
            onToggleMusic={toggleMusic}
          />
        </div>
      </aside>

      {/* Bottom Right - Now Playing Card */}
      <div className="fixed bottom-8 right-8 z-20">
        <NowPlayingCard
          timerState={timerState}
          timerStatus={timerStatus}
          isMusicEnabled={isMusicEnabled}
        />
      </div>
    </main>
  );
}
