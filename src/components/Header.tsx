'use client';

export function Header() {
  return (
    <header className="w-full py-6">
      <div className="flex items-center justify-center gap-3">
        {/* Logo */}
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <TomatoIcon />
          </div>
        </div>
        
        {/* App Name */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Focusly
          </h1>
          <span className="text-xs text-white/40 -mt-1">
            Deep work, made simple
          </span>
        </div>
      </div>
    </header>
  );
}

function TomatoIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C11.5 2 11 2.19 10.59 2.59L9.17 4H7C4.24 4 2 6.24 2 9C2 10.33 2.5 11.53 3.29 12.44C2.5 13.34 2 14.52 2 15.84C2 18.62 4.24 21 7 21H17C19.76 21 22 18.62 22 15.84C22 14.52 21.5 13.34 20.71 12.44C21.5 11.53 22 10.33 22 9C22 6.24 19.76 4 17 4H14.83L13.41 2.59C13 2.19 12.5 2 12 2Z"/>
    </svg>
  );
}
