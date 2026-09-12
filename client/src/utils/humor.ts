export const LOADING_MESSAGES = [
  "Loading nothing...",
  "Still loading nothing...",
  "Nothing is taking longer than expected...",
  "Please wait while absolutely nothing happens...",
  "Consulting the void...",
  "Calculating zero deliverables...",
  "Optimizing complete inactivity...",
  "Simulating urgent corporate busyness..."
];

export const EMPTY_STATE_MESSAGES = [
  { title: "There is nothing here.", subtitle: "Exactly as intended." },
  { title: "Zero data points detected.", subtitle: "The ideal operational state." },
  { title: "Total void achieved.", subtitle: "No meetings, no deadlines, no progress." }
];

export const AVATAR_OPTIONS = [
  { id: 'sloth', label: 'The Sloth', icon: '🦥', desc: 'Masters of 0.001 mph movement' },
  { id: 'couch', label: 'Couch Potato', icon: '🛋️', desc: 'Indent permanently imprinted on the cushions' },
  { id: 'cat', label: 'Sleeping Cat', icon: '🐱', desc: 'Sleeping 22 hours daily with zero remorse' },
  { id: 'chair', label: 'Empty Chair', icon: '🪑', desc: 'Present in calendar, absent in body' },
  { id: 'pebble', label: 'Zen Pebble', icon: '🪨', desc: 'It does nothing, yet does everything' },
  { id: 'cloud', label: 'Blank Cloud', icon: '☁️', desc: 'Drifting aimlessly without objective' }
];

export function getRandomLoadingMessage(): string {
  const index = Math.floor(Math.random() * LOADING_MESSAGES.length);
  return LOADING_MESSAGES[index];
}
