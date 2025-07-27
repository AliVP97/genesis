import { BREAKPOINTS } from './constants';
import { DeviceSize } from './types';

export const getDeviceSize = (): { width: number; size: DeviceSize } => {
  const width = window.innerWidth;

  let size: DeviceSize;

  switch (true) {
    case width < BREAKPOINTS.xxs:
      size = 'xxs';
      break;
    case width < BREAKPOINTS.sm:
      size = 'xs';
      break;
    case width < BREAKPOINTS.md:
      size = 'sm';
      break;
    case width < BREAKPOINTS.lg:
      size = 'md';
      break;
    case width < BREAKPOINTS.xl:
      size = 'lg';
      break;
    case width < BREAKPOINTS.xxl:
      size = 'xl';
      break;
    default:
      size = 'xxl';
  }

  return { width, size };
};

export const getSizeValue = (size: DeviceSize | number): number =>
  typeof size === 'number' ? size : BREAKPOINTS[size];
