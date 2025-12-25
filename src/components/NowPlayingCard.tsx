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
      className="rounded-xl border transition-all duration-300"
      style={{
        width: '200px',
        padding: '14px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        {isPlaying ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ width: '2px', height: '8px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} className="animate-pulse" />
            <span style={{ width: '2px', height: '12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} className="animate-pulse" />
            <span style={{ width: '2px', height: '6px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} className="animate-pulse" />
            <span style={{ width: '2px', height: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} className="animate-pulse" />
          </div>
        ) : (
          <MutedIcon />
        )}
        <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isPlaying ? 'Now Playing' : 'Muted'}
        </span>
      </div>

      {/* Music Info */}
      {music && (
        <div style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'white', marginBottom: '3px' }}>
            {music.title}
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
            {music.artist}
          </p>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '10px' }} />

      {/* Link */}
      {music && (
        <a
          href={music.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '10px', 
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
          }}
          className="hover:text-white/50 transition-colors cursor-pointer"
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
    <svg style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.35)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg style={{ width: '10px', height: '10px', marginLeft: 'auto', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
