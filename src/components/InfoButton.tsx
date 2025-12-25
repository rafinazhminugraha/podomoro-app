'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  // Force fresh render each time modal opens
  useEffect(() => {
    if (isOpen) {
      setModalKey(prev => prev + 1);
    }
  }, [isOpen]);

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed top-4 right-4 sm:top-6 sm:right-6 z-50
          w-9 h-9 sm:w-10 sm:h-10
          rounded-full bg-white/5 border border-white/10
          flex items-center justify-center
          text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20
          transition-all duration-300
          cursor-pointer outline-none
          active:scale-95
        "
        aria-label="What is Pomodoro?"
      >
        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          key={modalKey}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop - separate element without animation */}
          <div 
            className="absolute inset-0 bg-black/20"
            style={{ 
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(15px)'
            }} 
          />
          
          {/* Modal Card - animation on wrapper, blur on inner */}
          <div className="relative max-w-md w-full animate-fadeIn">
            <div 
              className="
                bg-white/3 border border-white/15 rounded-2xl
                p-6 sm:p-8
                shadow-2xl shadow-black/50
              "
              style={{ 
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)'
              }}
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
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <span className="text-xl">🍅</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  What is Pomodoro?
                </h2>
              </div>

              {/* Content */}
              <div className="space-y-4 text-white/70 text-sm sm:text-base leading-relaxed">
                <p>
                  The <span className="text-white font-medium">Pomodoro Technique</span> is a simple way to stay focused and get things done without burning out.
                </p>

                {/* Steps */}
                <div className="space-y-3 py-2">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <p>
                      <span className="text-white font-medium">Pick a task</span> you want to work on
                    </p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <p>
                      <span className="text-white font-medium">Work for 25 minutes</span> with full focus (no distractions!)
                    </p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <p>
                      <span className="text-white font-medium">Take a 5-minute break</span> — stretch, grab water, relax
                    </p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      4
                    </div>
                    <p>
                      <span className="text-white font-medium">Repeat!</span> After 4 sessions, take a longer 15-30 min break
                    </p>
                  </div>
                </div>

                {/* Why it works */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/50 text-xs sm:text-sm">
                    <span className="text-white/70">Why it works:</span> Your brain stays fresh because you work in short bursts with regular breaks. No more burnout!
                  </p>
                </div>
              </div>

              {/* Got it Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="
                  w-full mt-6 py-3
                  rounded-xl bg-white/5 border border-white/10
                  text-white font-medium
                  hover:bg-white/10 hover:border-white/20
                  transition-all duration-200
                  cursor-pointer outline-none active:scale-[0.98]
                "
              >
                Got it! 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

