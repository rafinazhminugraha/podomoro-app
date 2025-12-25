'use client';

import { useState } from 'react';
import { PomodoroTemplate } from '@/types';
import { POMODORO_TEMPLATES, CUSTOM_TEMPLATE } from '@/data/templates';

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

  const handleCustomApply = () => {
    onCustomDurations(customFocus, customBreak);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-white/90 mb-2">Choose Your Focus Mode</h2>
        <p className="text-sm text-white/50">Select a template or create your own</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {POMODORO_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            disabled={disabled}
            className={`
              group relative p-4 rounded-2xl border transition-all duration-300
              ${!isCustomMode && selectedTemplate?.id === template.id
                ? 'bg-white/10 border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Selection indicator */}
            {!isCustomMode && selectedTemplate?.id === template.id && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50" />
            )}
            
            <div className="text-center">
              <span className="block text-sm font-medium text-white/80 mb-1">
                {template.name}
              </span>
              <span className="block text-2xl font-light text-white mb-1">
                {template.focusDuration}
              </span>
              <span className="block text-xs text-white/40">
                + {template.breakDuration} min break
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Mode Toggle */}
      <div className="mt-6">
        <button
          onClick={handleCustomToggle}
          disabled={disabled}
          className={`
            w-full p-4 rounded-2xl border transition-all duration-300
            ${isCustomMode
              ? 'bg-white/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <CustomIcon />
            <span className="font-medium text-white/80">Custom Mode</span>
          </div>
        </button>

        {/* Custom Duration Inputs */}
        {isCustomMode && !disabled && (
          <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fadeIn">
            <div className="grid grid-cols-2 gap-6">
              {/* Focus Duration */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Focus Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={customFocus}
                    onChange={(e) => setCustomFocus(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                    className="
                      w-full px-4 py-3 pr-16 rounded-xl
                      bg-white/5 border border-white/10
                      text-white text-lg font-light
                      focus:outline-none focus:border-emerald-500/50 focus:bg-white/8
                      transition-all duration-200
                    "
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    min
                  </span>
                </div>
              </div>

              {/* Break Duration */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Break Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={customBreak}
                    onChange={(e) => setCustomBreak(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="
                      w-full px-4 py-3 pr-16 rounded-xl
                      bg-white/5 border border-white/10
                      text-white text-lg font-light
                      focus:outline-none focus:border-emerald-500/50 focus:bg-white/8
                      transition-all duration-200
                    "
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    min
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleCustomApply}
              className="
                w-full mt-4 py-3 rounded-xl
                bg-emerald-500/20 text-emerald-400 font-medium
                border border-emerald-500/30
                hover:bg-emerald-500/30 hover:border-emerald-500/50
                transition-all duration-200
              "
            >
              Apply Custom Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomIcon() {
  return (
    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}
