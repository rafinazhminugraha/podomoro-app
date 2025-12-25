'use client';

import { useTimer } from '@/hooks';
import {
  TimerDisplay,
  TimerControls,
  ModeSelector,
  SessionCounter,
  SettingsPanel,
} from '@/components';

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
            timerState === 'break' ? 'bg-emerald-500/20' : 'bg-white/5'}
        `}
      />
      <div 
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/2
          w-150 h-150 rounded-full
          blur-[120px] pointer-events-none
          transition-all duration-1000 ease-out
          ${timerState === 'focus' ? 'bg-rose-500/20' : 
            timerState === 'break' ? 'bg-emerald-500/20' : 'bg-white/5'}
        `}
      />

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Timer - Always Centered */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="flex flex-col items-center pointer-events-auto">
          <TimerDisplay
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            timerState={timerState}
            timerStatus={timerStatus}
          />
          <div className="mt-8">
            <SessionCounter sessionsCompleted={sessionsCompleted} />
          </div>
        </div>
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
    </main>
  );
}
