export const TEXT_DIRECTIONS = { LTR: 'ltr', RTL: 'rtl' } as const;

export type TextDirection = (typeof TEXT_DIRECTIONS)[keyof typeof TEXT_DIRECTIONS];
