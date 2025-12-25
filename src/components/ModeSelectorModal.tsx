'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings2 } from 'lucide-react';
import { PomodoroTemplate } from '@/types';
import { POMODORO_TEMPLATES } from '@/data/templates';
import { Plus, Minus } from 'lucide-react';

interface ModeSelectorModalProps {
  selectedTemplate: PomodoroTemplate | null;
  onSelectTemplate: (template: PomodoroTemplate) => void;
  onCustomDurations: (focus: number, breakDuration: number) => void;
  disabled?: boolean;
}

export function ModeSelectorModal({
  selectedTemplate,
  onSelectTemplate,
  onCustomDurations,
  disabled = false,
}: ModeSelectorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [modalKey, setModalKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Force fresh render each time modal opens (matching InfoButton pattern)
  useEffect(() => {
    if (isOpen) {
      setModalKey(prev => prev + 1);
    }
  }, [isOpen]);

  const handleTemplateSelect = (template: PomodoroTemplate) => {
    setIsCustomMode(false);
    onSelectTemplate(template);
    // Close modal after selection
    setIsOpen(false);
  };

  const handleCustomToggle = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      onCustomDurations(customFocus, customBreak);
    }
  };

  const handleCustomApply = () => {
    onCustomDurations(customFocus, customBreak);
    setIsOpen(false);
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

  // Get current display text
  const getCurrentDisplayText = () => {
    if (isCustomMode) {
      return `Custom: ${customFocus}:${customBreak}`;
    }
    if (selectedTemplate) {
      return `${selectedTemplate.name}: ${selectedTemplate.focusDuration}:${selectedTemplate.breakDuration}`;
    }
    return 'Select Mode';
  };

  return (
    <>
      {/* Trigger Button - Centered at bottom */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-5 py-3
          rounded-2xl border transition-all duration-300
          outline-none active:scale-95
          ${disabled 
            ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed' 
            : 'bg-white/8 border-white/15 hover:bg-white/12 hover:border-white/25 cursor-pointer'
          }
        `}
      >
        <Settings2 className="w-5 h-5 text-white/70" strokeWidth={1.5} />
        <span className="text-sm font-medium text-white">
          {getCurrentDisplayText()}
        </span>
      </button>

      {/* Modal Overlay - Using Portal for proper centering */}
      {mounted && isOpen && createPortal(
        <div 
          key={modalKey}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop - separate element without animation (matching InfoButton) */}
          <div 
            className="absolute inset-0 bg-black/20"
            style={{ 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }} 
          />
          
          {/* Modal Card - animation on wrapper, blur on inner (matching InfoButton) */}
          <div className="relative max-w-sm w-full animate-fadeIn">
            <div 
              className="
                bg-white/3 border border-white/15 rounded-2xl
                p-6
                shadow-2xl shadow-black/50
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="
                  absolute top-4 right-4
                  w-8 h-8 rounded-full
                  flex items-center justify-center
                  text-white/40 hover:text-white hover:bg-white/10
                  transition-all duration-200 cursor-pointer outline-none
                "
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Select Mode
                </h2>
              </div>

              {/* Template Grid - 2x2 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {POMODORO_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    disabled={disabled}
                    className={`
                      group relative rounded-xl border transition-all duration-300
                      py-4 px-3
                      flex flex-col items-center justify-center gap-1
                      outline-none active:scale-[0.98]
                      ${!isCustomMode && selectedTemplate?.id === template.id
                        ? 'bg-white/12 border-white/25'
                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15'
                      }
                      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    <span className="text-xs font-medium text-white/60 tracking-wide uppercase">
                      {template.name}
                    </span>
                    <span className="text-2xl font-light text-white tracking-tight">
                      {template.focusDuration} : {template.breakDuration}
                    </span>
                    <span className="text-[10px] font-medium text-white/40 tracking-wide">
                      Focus : Break
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Mode Section */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={handleCustomToggle}
                  disabled={disabled}
                  className={`
                    w-full rounded-xl border transition-all duration-300
                    py-4 px-3
                    flex flex-col items-center justify-center gap-1
                    outline-none active:scale-[0.98]
                    ${isCustomMode
                      ? 'bg-white/12 border-white/25'
                      : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15'
                    }
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                >
                  <span className="text-xs font-medium text-white/60 tracking-wide uppercase">
                    Custom
                  </span>
                  <span className="text-2xl font-light text-white tracking-tight">
                    {customFocus} : {customBreak}
                  </span>
                  <span className="text-[10px] font-medium text-white/40 tracking-wide">
                    Focus : Break
                  </span>
                </button>

                {/* Custom Settings Panel */}
                {isCustomMode && !disabled && (
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 animate-fadeIn">
                    {/* Focus Row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/50">Focus</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFocusChange(customFocus - 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 
                                   text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                                   flex items-center justify-center outline-none active:scale-90 transition-all"
                        >
                          <Minus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={customFocus}
                          onChange={(e) => handleFocusChange(parseInt(e.target.value) || 1)}
                          className="w-14 h-8 rounded-lg bg-white/5 border border-white/10
                                   text-white text-sm font-medium text-center
                                   outline-none focus:outline-none focus:ring-0 selection:bg-white/20"
                        />
                        <button
                          onClick={() => handleFocusChange(customFocus + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 
                                   text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                                   flex items-center justify-center outline-none active:scale-90 transition-all"
                        >
                          <Plus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <span className="text-xs text-white/40 ml-1">min</span>
                      </div>
                    </div>

                    {/* Break Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-white/50">Break</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBreakChange(customBreak - 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 
                                   text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                                   flex items-center justify-center outline-none active:scale-90 transition-all"
                        >
                          <Minus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={customBreak}
                          onChange={(e) => handleBreakChange(parseInt(e.target.value) || 1)}
                          className="w-14 h-8 rounded-lg bg-white/5 border border-white/10
                                   text-white text-sm font-medium text-center
                                   outline-none focus:outline-none focus:ring-0 selection:bg-white/20"
                        />
                        <button
                          onClick={() => handleBreakChange(customBreak + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 
                                   text-white/60 hover:bg-white/10 hover:text-white cursor-pointer
                                   flex items-center justify-center outline-none active:scale-90 transition-all"
                        >
                          <Plus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <span className="text-xs text-white/40 ml-1">min</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={handleCustomApply}
                      className="
                        w-full py-3
                        rounded-xl bg-white/10 border border-white/15
                        text-white font-medium
                        hover:bg-white/15 hover:border-white/25
                        transition-all duration-200
                        cursor-pointer outline-none active:scale-[0.98]
                      "
                    >
                      Apply Custom Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
