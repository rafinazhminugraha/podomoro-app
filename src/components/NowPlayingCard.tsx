'use client';

import { VolumeX, Youtube, ExternalLink } from 'lucide-react';
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
          <VolumeX className="w-3 h-3 text-white/35" strokeWidth={1.5} />
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
          <Youtube className="w-3 h-3" />
          <span>View on YouTube</span>
          <ExternalLink className="w-2.5 h-2.5 ml-auto opacity-50" strokeWidth={1.5} />
        </a>
      )}
    </div>
  );
}

