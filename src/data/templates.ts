import { PomodoroTemplate } from '@/types';

export const POMODORO_TEMPLATES: PomodoroTemplate[] = [
  {
    id: 'short-focus',
    name: 'Quick Sprint',
    focusDuration: 20,
    breakDuration: 5,
    description: 'Perfect for smaller tasks or when starting out',
  },
  {
    id: 'standard',
    name: 'Classic Pomodoro',
    focusDuration: 25,
    breakDuration: 5,
    description: 'The traditional Pomodoro technique',
  },
  {
    id: 'extended',
    name: 'Deep Work',
    focusDuration: 40,
    breakDuration: 10,
    description: 'Extended focus for complex tasks',
  },
  {
    id: 'ultra',
    name: 'Flow State',
    focusDuration: 50,
    breakDuration: 10,
    description: 'Maximum focus for deep concentration',
  },
];

export const CUSTOM_TEMPLATE: PomodoroTemplate = {
  id: 'custom',
  name: 'Custom',
  focusDuration: 25,
  breakDuration: 5,
  description: 'Set your own durations',
};
