'use client';

import { useTimer } from '@/hooks';
import {
  Header,
  TimerDisplay,
  TimerControls,
  ModeSelector,
  SessionCounter,
  SettingsPanel,
} from '@/components';
import { getStateGradient } from '@/lib/utils';

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
  const gradientClass = getStateGradient(timerState);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[#0a0a0f] -z-10" />
      
      {/* Animated Gradient Orbs */}
      <div 
        className={`
          gradient-orb w-[600px] h-[600px] -top-[200px] -left-[200px]
          transition-all duration-1000 ease-out
          ${timerState === 'focus' ? 'gradient-orb-focus opacity-30' : 
            timerState === 'break' ? 'gradient-orb-break opacity-30' : 'opacity-10'}
        `}
        style={{ animationDuration: '20s' }}
      />
      <div 
        className={`
          gradient-orb w-[500px] h-[500px] -bottom-[150px] -right-[150px]
          transition-all duration-1000 ease-out animate-breathe
          ${timerState === 'focus' ? 'gradient-orb-focus opacity-20' : 
            timerState === 'break' ? 'gradient-orb-break opacity-20' : 'opacity-5'}
        `}
      />
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 -z-10" />
      
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-8">
          
          {/* Timer Section */}
          <section className="w-full flex flex-col items-center mb-12">
            {/* Timer Display */}
            <div className="mb-8">
              <TimerDisplay
                timeRemaining={timeRemaining}
                totalTime={totalTime}
                timerState={timerState}
                timerStatus={timerStatus}
              />
            </div>

            {/* Current Mode Indicator (when active) */}
            {isTimerActive && currentTemplate && (
              <div className="mb-6 text-center animate-fadeIn">
                <span className="text-sm text-white/40">
                  {currentTemplate.name} • {currentTemplate.focusDuration}min focus / {currentTemplate.breakDuration}min break
                </span>
              </div>
            )}

            {/* Timer Controls */}
            <div className="mb-8">
              <TimerControls
                timerStatus={timerStatus}
                timerState={timerState}
                hasTemplate={currentTemplate !== null}
                onStart={startTimer}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onReset={resetTimer}
              />
            </div>

            {/* Settings Panel */}
            <SettingsPanel
              isMusicEnabled={isMusicEnabled}
              onToggleMusic={toggleMusic}
            />
          </section>

          {/* Mode Selector Section (collapsed when timer is running) */}
          <section 
            className={`
              w-full transition-all duration-500 ease-out
              ${isTimerActive ? 'opacity-40 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
            `}
          >
            <ModeSelector
              selectedTemplate={currentTemplate}
              onSelectTemplate={selectTemplate}
              onCustomDurations={setCustomDurations}
              disabled={isTimerActive}
            />
          </section>

          {/* Session Counter */}
          <section className="mt-12 pt-8 border-t border-white/5 w-full max-w-md">
            <SessionCounter sessionsCompleted={sessionsCompleted} />
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 text-center">
          <p className="text-xs text-white/30">
            Built for deep work • No distractions, just focus
          </p>
        </footer>
      </div>
    </main>
  );
}
