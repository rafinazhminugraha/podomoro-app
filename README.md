# 🍅 Focusly - Deep Work Pomodoro Timer

A minimal, elegant Pomodoro timer designed for deep work and mental clarity. Built with Next.js 15, TypeScript, and Tailwind CSS.

![Focusly Screenshot](./docs/screenshot.png)

## ✨ Features

### Core Features
- **Pomodoro Mode Selection**
  - 4 predefined templates (Quick Sprint, Classic Pomodoro, Deep Work, Flow State)
  - Custom mode with adjustable focus and break durations
  - Clear visual selection system

- **Focus & Break Behavior**
  - ADHD-friendly background music during focus sessions
  - Calm lofi/relaxing music during breaks
  - Music is fully toggleable (on/off)
  - Silent mode when music is disabled (except alarms)

- **Audio Cues**
  - Gentle alarm at focus session start
  - Soft chime at break start
  - Alarms always play (even with music off)
  - Comfortable, non-aggressive volume levels

- **Timer Logic**
  - Accurate countdown timer
  - Automatic focus ↔ break transitions
  - Clear state indicators (Focus Time, Break Time, Paused)
  - Full controls: Start, Pause, Resume, Reset

### Additional Features
- 📊 **Session Counter** - Track completed focus sessions today
- ⭕ **Circular Progress Ring** - Visual progress indicator with glow effects
- 🎨 **Dynamic Themes** - Colors shift based on focus vs break state
- 💬 **Motivational Messages** - Encouragement based on session count
- ✨ **Elegant Animations** - Subtle transitions that don't distract

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/focusly.git
cd focusly

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Add Audio Files (Required)

Place the following audio files in `/public/audio/`:

| File | Purpose | Recommended |
|------|---------|-------------|
| `focus-music.mp3` | Background music during focus | ADHD-friendly beats, binaural beats |
| `break-music.mp3` | Background music during breaks | Calm lofi, ambient sounds |
| `alarm-start.mp3` | Focus session start alarm | Gentle chime (2-5 sec) |
| `alarm-break.mp3` | Break time alarm | Soft bell (2-5 sec) |

**Free audio resources:**
- [Pixabay Music](https://pixabay.com/music/) - Royalty-free music
- [Freesound](https://freesound.org/) - Sound effects
- [Free Music Archive](https://freemusicarchive.org/) - Various genres

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles, animations, utilities
│   ├── layout.tsx       # Root layout with fonts & SEO
│   └── page.tsx         # Main Pomodoro page
├── components/
│   ├── Header.tsx       # App branding
│   ├── TimerDisplay.tsx # Circular timer with progress ring
│   ├── TimerControls.tsx# Start/Pause/Resume/Reset buttons
│   ├── ModeSelector.tsx # Template & custom mode selection
│   ├── SessionCounter.tsx# Session tracking with motivational messages
│   └── SettingsPanel.tsx# Music toggle
├── hooks/
│   ├── useTimer.ts      # Core timer logic & state management
│   └── useAudio.ts      # Audio playback controller
├── lib/
│   ├── audio.ts         # Audio file paths & volume config
│   └── utils.ts         # Formatting & utility functions
├── data/
│   └── templates.ts     # Pomodoro template definitions
└── types/
    └── index.ts         # TypeScript type definitions
```

## 🏗️ Architecture

### Timer Logic (`useTimer` hook)
The timer uses React state and `setInterval` for accurate countdown:

1. **State Management**: Tracks `timerState` (idle/focus/break), `timerStatus` (idle/running/paused), and `timeRemaining`
2. **Automatic Transitions**: When focus completes → auto-starts break; when break completes → auto-starts focus
3. **Session Tracking**: Increments session count after each focus completion
4. **Audio Coordination**: Plays appropriate music and alarms at state changes

### Audio Playback (`useAudio` hook)
- Creates `HTMLAudioElement` instances on mount
- Music loops continuously during sessions
- Alarms are one-shot sounds at transitions
- Graceful handling of browser autoplay restrictions

### Component Responsibilities
- **TimerDisplay**: Visual countdown with SVG progress ring
- **TimerControls**: Dynamic button states based on timer status
- **ModeSelector**: Template cards + custom duration inputs
- **SessionCounter**: Progress dots + motivational feedback

## 🎨 Design Decisions

### Why This Aesthetic?
- **Dark theme**: Reduces eye strain during long focus sessions
- **Subtle gradients**: Rose for focus (energizing), Emerald for break (calming)
- **Minimal chrome**: Nothing to distract from the task at hand
- **Large timer**: Primary focus element, easy to glance at

### UX Principles Applied
- **Zero confusion**: Clear state indicators, obvious primary action
- **Calm transitions**: Smooth animations that don't jar attention
- **Progressive disclosure**: Mode selector fades when timer is active
- **Feedback everywhere**: Visual confirmation for all interactions

## 🚀 Deployment

### Deploy to Vercel

```bash
# Build for production
npm run build

# Deploy with Vercel CLI
npx vercel
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Inter (UI), JetBrains Mono (timer)
- **Audio**: Web Audio API via HTMLAudioElement
- **State**: React hooks (no external state library)

## 📝 License

MIT License - feel free to use this for personal or commercial projects.

---

Built with ❤️ for deep work enthusiasts. Focus better, achieve more.
