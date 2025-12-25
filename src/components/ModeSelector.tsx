'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { PomodoroTemplate } from '@/types';
import { POMODORO_TEMPLATES } from '@/data/templates';

interface ModeSelectorProps {
  selectedTemplate: PomodoroTemplate | null;
  onSelectTemplate: (template: PomodoroTemplate) => void;
  onCustomDurations: (focus: number, breakDuration: number) => void;
  disabled?: boolean;
  horizontal?: boolean; // For mobile horizontal layout
}

export function ModeSelector({
  selectedTemplate,
  onSelectTemplate,
  onCustomDurations,
  disabled = false,
  horizontal = false,
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

  // Mobile layout - Premium design matching desktop aesthetic
  if (horizontal) {
      return (
        <div className="flex flex-col gap-1.5 w-full"> {/* Gap diperkecil jadi 1.5 */}
          
          {/* Preset Templates - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {POMODORO_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                disabled={disabled}
                className={`
                  group relative rounded-xl border transition-all duration-300
                  
                  py-2 px-2 min-h-17.5 
                  
                  flex flex-col items-center justify-center gap-0.5
                  outline-none active:scale-[0.98]
                  ${!isCustomMode && selectedTemplate?.id === template.id
                    ? 'bg-white/8 border-white/20'
                    : 'bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/12'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              >
                <span className="text-[9px] font-medium text-white/70 tracking-wide uppercase">
                  {template.name}
                </span>
                <span className="text-base font-medium text-white tracking-tight my-0.5">
                  {template.focusDuration} : {template.breakDuration}
                </span>
                <span className="text-[8px] font-medium text-white/30 tracking-wide">
                  Focus : Break
                </span>
              </button>
            ))}
          </div>

          {/* Custom Mode Row */}
          <div className={`grid gap-1.5 ${isCustomMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <button
              onClick={handleCustomToggle}
              disabled={disabled}
              className={`
                group relative rounded-xl border transition-all duration-300
                
                py-2 px-2 min-h-17.5
                
                flex flex-col items-center justify-center gap-0.5
                outline-none active:scale-[0.98]
                ${isCustomMode
                  ? 'bg-white/8 border-white/20'
                  : 'bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/12'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              <span className="text-[9px] font-medium text-white/70 tracking-wide uppercase">
                Custom
              </span>
              <span className="text-base font-medium text-white tracking-tight my-0.5">
                {customFocus} : {customBreak}
              </span>
              <span className="text-[8px] font-medium text-white/30 tracking-wide">
                Focus : Break
              </span>
            </button>

            {/* Custom Settings - Super Compact Panel */}
            {isCustomMode && !disabled && (
              <div className={`
                rounded-xl bg-white/3 border border-white/8
                py-2 px-3
                flex flex-col justify-center gap-1
                animate-fadeIn
              `}>
                {/* Focus Row */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider w-10">Focus</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleFocusChange(customFocus - 1)}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10 
                              text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                              flex items-center justify-center outline-none active:scale-90 transition-all"
                    >
                      <Minus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={customFocus}
                      onChange={(e) => handleFocusChange(parseInt(e.target.value) || 1)}
                      className="w-6 h-5 rounded bg-white/5 border border-white/10
                              text-white text-[10px] font-medium text-center
                              outline-none focus:outline-none focus:ring-0 selection:bg-white/20 p-0"
                    />
                    <button
                      onClick={() => handleFocusChange(customFocus + 1)}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10 
                              text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                              flex items-center justify-center outline-none active:scale-90 transition-all"
                    >
                      <Plus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Break Row */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider w-10">Break</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleBreakChange(customBreak - 1)}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10 
                              text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                              flex items-center justify-center outline-none active:scale-90 transition-all"
                    >
                      <Minus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={customBreak}
                      onChange={(e) => handleBreakChange(parseInt(e.target.value) || 1)}
                      className="w-6 h-5 rounded bg-white/5 border border-white/10
                              text-white text-[10px] font-medium text-center
                              outline-none focus:outline-none focus:ring-0 selection:bg-white/20 p-0"
                    />
                    <button
                      onClick={() => handleBreakChange(customBreak + 1)}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10 
                              text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                              flex items-center justify-center outline-none active:scale-90 transition-all"
                    >
                      <Plus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

  // Vertical layout for desktop (UNCHANGED)
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {/* Template Grid */}
      {POMODORO_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => handleTemplateSelect(template)}
          disabled={disabled}
          className={`
            ${boxClasses}
            w-28 h-24 p-2
            sm:w-32 sm:h-26 sm:p-3
            lg:w-34 lg:h-28
            ${!isCustomMode && selectedTemplate?.id === template.id
              ? 'bg-white/10 border-white/20'
              : 'bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-medium text-white tracking-wide">
              {template.name}
            </span>
            <span className="text-xl sm:text-2xl font-light text-white tracking-tight">
              {template.focusDuration} : {template.breakDuration}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-white/40 tracking-wide">
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
            w-28 h-24 p-2
            sm:w-32 sm:h-26 sm:p-3
            lg:w-34 lg:h-28
            ${isCustomMode
              ? 'bg-white/10 border-white/20'
              : 'bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-medium text-white tracking-wide">
              Custom
            </span>
            <span className="text-xl sm:text-2xl font-light text-white tracking-tight">
              {customFocus} : {customBreak}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-white/40 tracking-wide">
              Focus : Break
            </span>
          </div>
        </button>

        {/* Custom Settings Card - Right Side */}
        {isCustomMode && !disabled && (
          <div 
            className={`${cardClasses} px-6 py-3 sm:px-8 sm:py-4 flex flex-col items-center justify-center gap-3 sm:gap-4 animate-fadeIn`}
            style={{ width: '200px' }}
          >
            {/* Focus Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs font-medium text-white/50 w-8 sm:w-10">Focus</span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => handleFocusChange(customFocus - 1)}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
                </button>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customFocus}
                  onChange={(e) => handleFocusChange(parseInt(e.target.value) || 1)}
                  className="w-10 h-6 sm:w-12 sm:h-7 rounded-lg bg-white/5 border border-white/10
                           text-white text-xs sm:text-sm font-light text-center
                           outline-none focus:outline-none focus:ring-0 selection:bg-white/20 caret-white/50"
                />
                <button
                  onClick={() => handleFocusChange(customFocus + 1)}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Break Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs font-medium text-white/50 w-8 sm:w-10">Break</span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => handleBreakChange(customBreak - 1)}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
                </button>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={(e) => handleBreakChange(parseInt(e.target.value) || 1)}
                  className="w-10 h-6 sm:w-12 sm:h-7 rounded-lg bg-white/5 border border-white/10
                           text-white text-xs sm:text-sm font-light text-center
                           outline-none focus:outline-none focus:ring-0 selection:bg-white/20 caret-white/50"
                />
                <button
                  onClick={() => handleBreakChange(customBreak + 1)}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 border border-white/10 
                           text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                           flex items-center justify-center outline-none active:scale-90 transition-all"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}