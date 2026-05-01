import { logger } from './logger';

interface ScoreValidation {
  isValid: boolean;
  reason?: string;
}

const GAME_RULES: Record<string, { maxScore: number; maxDuration: number }> = {
  '2048': { maxScore: 1000000, maxDuration: 3600 }, // 1 hour
  'hextris': { maxScore: 999999, maxDuration: 1800 }, // 30 min
  'flappybird': { maxScore: 100000, maxDuration: 3600 },
  'microgames': { maxScore: 50000, maxDuration: 600 } // 10 min
};

export const validateScore = (
  gameName: string,
  score: number,
  duration?: number
): ScoreValidation => {
  const rules = GAME_RULES[gameName];

  if (!rules) {
    return { isValid: false, reason: 'Unknown game' };
  }

  if (score < 0) {
    return { isValid: false, reason: 'Score cannot be negative' };
  }

  if (score > rules.maxScore) {
    logger.warn(`Suspicious score submitted: ${gameName} - ${score}`);
    return { isValid: false, reason: 'Score exceeds maximum' };
  }

  if (duration && duration < 0) {
    return { isValid: false, reason: 'Duration cannot be negative' };
  }

  if (duration && duration > rules.maxDuration) {
    logger.warn(`Suspicious duration: ${gameName} - ${duration}s`);
    return { isValid: false, reason: 'Duration exceeds maximum' };
  }

  return { isValid: true };
};

export const calculateTotalScore = (scores: Record<string, number>): number => {
  return Object.values(scores).reduce((sum, score) => sum + score, 0);
};
