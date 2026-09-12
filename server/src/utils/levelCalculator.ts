export interface LevelInfo {
  level: number;
  title: string;
  minSessions: number;
  maxSessions: number | null;
  badge: string;
  description: string;
  nextLevelTitle?: string;
  progressPercentage: number;
  sessionsToNextLevel: number;
}

export const NOTHING_LEVELS = [
  {
    level: 1,
    title: 'Amateur Nothing',
    minSessions: 0,
    maxSessions: 5,
    badge: '🌱',
    description: 'Just starting to neglect responsibilities with mild guilt.'
  },
  {
    level: 2,
    title: 'Casual Nothing',
    minSessions: 5,
    maxSessions: 15,
    badge: '🛋️',
    description: 'Consistently ignoring productive impulses on a weekly basis.'
  },
  {
    level: 3,
    title: 'Professional Nothing',
    minSessions: 15,
    maxSessions: 30,
    badge: '💼',
    description: 'Able to look busy in front of coworkers while accomplishing strictly zero.'
  },
  {
    level: 4,
    title: 'Expert Nothing',
    minSessions: 30,
    maxSessions: 60,
    badge: '🎖️',
    description: 'Advanced mastery of deliberate inactivity and meeting evasion.'
  },
  {
    level: 5,
    title: 'Nothing Master',
    minSessions: 60,
    maxSessions: 100,
    badge: '🔮',
    description: 'Transcended the need for outcomes. Productivity is a distant memory.'
  },
  {
    level: 6,
    title: 'Grandmaster of Nothing',
    minSessions: 100,
    maxSessions: null,
    badge: '👑',
    description: 'A living void of infinite stillness and corporate disengagement.'
  }
];

export function calculateLevel(totalSessions: number): LevelInfo {
  let currentLevel = NOTHING_LEVELS[0];

  for (let i = NOTHING_LEVELS.length - 1; i >= 0; i--) {
    if (totalSessions >= NOTHING_LEVELS[i].minSessions) {
      currentLevel = NOTHING_LEVELS[i];
      break;
    }
  }

  const nextLevel = NOTHING_LEVELS.find(l => l.level === currentLevel.level + 1);

  let progressPercentage = 100;
  let sessionsToNextLevel = 0;

  if (nextLevel && currentLevel.maxSessions !== null) {
    const range = currentLevel.maxSessions - currentLevel.minSessions;
    const currentProgress = totalSessions - currentLevel.minSessions;
    progressPercentage = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
    sessionsToNextLevel = Math.max(0, nextLevel.minSessions - totalSessions);
  }

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    minSessions: currentLevel.minSessions,
    maxSessions: currentLevel.maxSessions,
    badge: currentLevel.badge,
    description: currentLevel.description,
    nextLevelTitle: nextLevel?.title,
    progressPercentage,
    sessionsToNextLevel
  };
}
