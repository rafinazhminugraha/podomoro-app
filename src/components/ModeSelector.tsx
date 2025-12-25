'use client';

import { useState } from 'react';
import { PomodoroTemplate } from '@/types';
import { POMODORO_TEMPLATES } from '@/data/templates';

interface ModeSelectorProps {
  selectedTemplate: PomodoroTemplate | null;
  onSelectTemplate: (template: PomodoroTemplate) => void;
  onCustomDurations: (focus: number, breakDuration: number) => void;
  disabled?: boolean;
}

export function ModeSelector({
  selectedTemplate,
  onSelectTemplate,
  onCustomDurations,
  disabled = false,
}: ModeSelectorProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);

  const handleTemplateSelect = (template: PomodoroTemplate) => {
    setIsCustomMode(false);
    onSelectTemplate(template);
  };

  const handleCustomToggle = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      onCustomDurations(customFocus, customBreak);
    }
  };

  const handleFocusChange = (value: number) => {
    const newValue = Math.max(1, Math.min(120, value || 1));
    setCustomFocus(newValue);
    if (isCustomMode) {
      onCustomDurations(newValue, customBreak);
    }
  };

  const handleBreakChange = (value: number) => {
    const newValue = Math.max(1, Math.min(60, value || 1));
    setCustomBreak(newValue);
    if (isCustomMode) {
      onCustomDurations(customFocus, newValue);
    }
  };

  const boxClasses = `
    group relative rounded-xl border transition-all duration-300
    flex items-center justify-center
    outline-none
    active:scale-95
  `;

  const cardClasses = `
    rounded-xl border transition-all duration-300
    bg-white/2 border-white/6
  `;

  return (
    <div className="flex flex-col gap-3">
      {/* Template Grid */}
      {POMODORO_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => handleTemplateSelect(template)}
          disabled={disabled}
          className={`
            ${boxClasses}
            w-34 h-28 p-3
            ${!isCustomMode && selectedTemplate?.id === template.id
              ? 'bg-white/10 border-white/20'
              : 'bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-white tracking-wide">
              {template.name}
            </span>
            <span className="text-2xl font-light text-white tracking-tight">
              {template.focusDuration} : {template.breakDuration}
            </span>
            <span className="text-xs font-medium text-white/40 tracking-wide">
              Focus : Break
            </span>
          </div>
        </button>
      ))}

      {/* Custom Mode - Horizontal Layout */}
      <div className="flex items-stretch gap-2">
        {/* Custom Button */}
        <button
          onClick={handleCustomToggle}
          disabled={disabled}
          className={`
            ${boxClasses}
            w-34 h-28 p-3
            ${isCustomMode
              ? 'bg-white/10 border-white/20'
              : 'bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-white tracking-wide">
              Custom
            </span>
            <span className="text-2xl font-light text-white tracking-tight">
              {customFocus} : {customBreak}
            </span>
            <span className="text-xs font-medium text-white/40 tracking-wide">
              Focus : Break
            </span>
          </div>
        </button>

        {/* Custom Settings Card - Right Side */}
        {isCustomMode && !disabled && (
          <div className={`${cardClasses} w-56 px-6 py-4 flex flex-col items-center justify-center gap-4 animate-fadeIn`}>
            {/* Focus Row */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/50 w-10">Focus</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleFocusChange(customFocus - 1)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <MinusIcon />
                </button>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customFocus}
                  onChange={(e) => handleFocusChange(parseInt(e.target.value) || 1)}
                  className="w-12 h-7 rounded-lg bg-white/5 border border-white/10
                           text-white text-sm font-light text-center
                           outline-none focus:outline-none focus:ring-0 selection:bg-white/20 caret-white/50"
                />
                <button
                  onClick={() => handleFocusChange(customFocus + 1)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* Break Row */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/50 w-10">Break</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleBreakChange(customBreak - 1)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <MinusIcon />
                </button>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={(e) => handleBreakChange(parseInt(e.target.value) || 1)}
                  className="w-12 h-7 rounded-lg bg-white/5 border border-white/10
                           text-white text-sm font-light text-center
                           outline-none focus:outline-none focus:ring-0 selection:bg-white/20 caret-white/50"
                />
                <button
                  onClick={() => handleBreakChange(customBreak + 1)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 12H6" />
    </svg>
  );
}
