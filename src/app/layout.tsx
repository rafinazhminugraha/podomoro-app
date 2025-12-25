import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pomoductive - Deep Work Pomodoro Timer',
  description: 'A minimal, elegant Pomodoro timer designed for deep work and mental clarity. Focus better, achieve more.',
  keywords: ['pomodoro', 'timer', 'focus', 'deep work', 'productivity', 'concentration'],
  authors: [{ name: 'Pomoductive' }],
  creator: 'Pomoductive',
  icons: {
    icon: '/img/time.png',
    shortcut: '/img/time.png',
    apple: '/img/time.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Pomoductive - Deep Work Pomodoro Timer',
    description: 'A minimal, elegant Pomodoro timer designed for deep work and mental clarity.',
    siteName: 'Pomoductive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomoductive - Deep Work Pomodoro Timer',
    description: 'A minimal, elegant Pomodoro timer designed for deep work and mental clarity.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
