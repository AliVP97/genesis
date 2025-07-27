import { DEVICE_SIZES } from './constants';

export type DeviceSize = (typeof DEVICE_SIZES)[keyof typeof DEVICE_SIZES];

export type Breakpoint = Record<
  'up' | 'down',
  (size: DeviceSize | number) => (width: number) => boolean
> & {
  between: (start: DeviceSize | number, end: DeviceSize | number) => (width: number) => boolean;
};

export type BreakpointMatcher = (width: number) => boolean;

export type BreakpointMatcherFactory = (breakpoint: Breakpoint) => BreakpointMatcher;
