'use client';

import { TimerState, TimerStatus } from '@/types';

interface NowPlayingCardProps {
  timerState: TimerState;
  timerStatus: TimerStatus;
  isMusicEnabled: boolean;
}

const MUSIC_INFO = {
  focus: {
    title: 'Focus Music',
    artist: 'Jason Lewis - Mind Amend',
    url: 'https://www.youtube.com/watch?v=jvM9AfAzoSo',
  },
  break: {
    title: 'Lofi Music',
    artist: 'Lofi Kitty',
    url: 'https://www.youtube.com/watch?v=01dn67QubYQ',
  },
};

export function NowPlayingCard({ timerState, timerStatus, isMusicEnabled }: NowPlayingCardProps) {
  const isPlaying = timerStatus === 'running' && isMusicEnabled;
  const musicType = timerState === 'focus' || timerState === 'break' ? timerState : null;
  const music = musicType ? MUSIC_INFO[musicType] : null;

  // Only show when there's active music type
  if (!musicType || timerStatus === 'idle') {
    return null;
  }

  return (
    <div 
      className="rounded-xl border transition-all duration-300 w-44 sm:w-48 md:w-52 px-3 py-2.5 sm:px-4 sm:py-3 md:px-4 md:py-3.5"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 sm:mb-2.5 md:mb-3">
        {isPlaying ? (
          <div className="flex items-center gap-0.5">
            <span className="w-0.5 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1.5 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 h-2.5 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
          </div>
        ) : (
          <MutedIcon />
        )}
        <span className="text-[9px] sm:text-[10px] font-medium text-white/35 uppercase tracking-wider">
          {isPlaying ? 'Now Playing' : 'Muted'}
        </span>
      </div>

      {/* Music Info */}
      {music && (
        <div className="mb-2 sm:mb-2.5 md:mb-3">
          <p className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1 truncate">
            {music.title}
          </p>
          <p className="text-[10px] sm:text-xs text-white/45 truncate">
            {music.artist}
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-white/6 mb-2 sm:mb-2.5 md:mb-3" />

      {/* Link */}
      {music && (
        <a
          href={music.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-white/30 hover:text-white/50 transition-colors cursor-pointer"
        >
          <YoutubeIcon />
          <span>View on YouTube</span>
          <ExternalLinkIcon />
        </a>
      )}
    </div>
  );
}

function MutedIcon() {
  return (
    <svg className="w-3 h-3 text-white/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-2.5 h-2.5 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
