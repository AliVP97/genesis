export const STEPS = {
  SELECT_PATH: 'SELECT_PATH',
  SELECT_REASON: 'SELECT_REASON',
  SELECT_PASSENGERS: 'SELECT_PASSENGERS',
} as const;

export type Step = (typeof STEPS)[keyof typeof STEPS];
