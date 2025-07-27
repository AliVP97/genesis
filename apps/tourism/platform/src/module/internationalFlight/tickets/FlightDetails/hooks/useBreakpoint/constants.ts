import { DeviceSize } from './types';

export const DEVICE_SIZES = {
  XSS: 'xxs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',
} as const;

export const BREAKPOINTS: Record<DeviceSize, number> = {
  [DEVICE_SIZES.XSS]: 360,
  [DEVICE_SIZES.XS]: 576,
  [DEVICE_SIZES.SM]: 768,
  [DEVICE_SIZES.MD]: 992,
  [DEVICE_SIZES.LG]: 1200,
  [DEVICE_SIZES.XL]: 1400,
  [DEVICE_SIZES.XXL]: 1600,
} as const;
