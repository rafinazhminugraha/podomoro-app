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
          w-[600px] h-[600px] rounded-full
          blur-[120px] pointer-events-none
          transition-all duration-1000 ease-out
          ${timerState === 'focus' ? 'bg-rose-500/20' : 
            timerState === 'break' ? 'bg-emerald-500/20' : 'bg-white/5'}
        `}
      />
      <div 
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/2
          w-[600px] h-[600px] rounded-full
          blur-[120px] pointer-events-none
          transition-all duration-1000 ease-out
          ${timerState === 'focus' ? 'bg-rose-500/20' : 
            timerState === 'break' ? 'bg-emerald-500/20' : 'bg-white/5'}
        `}
      />

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Main Content - Three Column Layout */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-7xl flex items-center justify-between gap-8">
          
          {/* Left Panel - Mode Selector */}
          <aside 
            className={`
              flex-shrink-0 transition-all duration-500
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

          {/* Center - Timer + Session Counter */}
          <div className="flex flex-col items-center justify-center flex-1">
            {/* Timer Display */}
            <TimerDisplay
              timeRemaining={timeRemaining}
              totalTime={totalTime}
              timerState={timerState}
              timerStatus={timerStatus}
            />

            {/* Session Counter - Below Timer */}
            <div className="mt-8">
              <SessionCounter sessionsCompleted={sessionsCompleted} />
            </div>
          </div>

          {/* Right Panel - Controls */}
          <aside className="shrink-0">
            <div className="flex flex-col gap-4">
              {/* Timer Controls */}
              <TimerControls
                timerStatus={timerStatus}
                timerState={timerState}
                hasTemplate={currentTemplate !== null}
                onStart={startTimer}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onReset={resetTimer}
              />

              {/* Music Toggle */}
              <SettingsPanel
                isMusicEnabled={isMusicEnabled}
                onToggleMusic={toggleMusic}
              />
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
