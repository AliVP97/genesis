import { BREAKPOINTS } from './constants';
import { getDeviceSize } from './utils';

describe('getDeviceSize', () => {
  const mockWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('should return xxs for width less than BREAKPOINTS.xxs', () => {
    mockWindowWidth(BREAKPOINTS.xxs - 1);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.xxs - 1, size: 'xxs' });
  });

  it('should return xs for width less than BREAKPOINTS.sm', () => {
    mockWindowWidth(BREAKPOINTS.sm - 1);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.sm - 1, size: 'xs' });
  });

  it('should return sm for width less than BREAKPOINTS.md', () => {
    mockWindowWidth(BREAKPOINTS.md - 1);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.md - 1, size: 'sm' });
  });

  it('should return md for width less than BREAKPOINTS.lg', () => {
    mockWindowWidth(BREAKPOINTS.lg - 1);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.lg - 1, size: 'md' });
  });

  it('should return lg for width less than BREAKPOINTS.xl', () => {
    mockWindowWidth(BREAKPOINTS.xl - 1);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.xl - 1, size: 'lg' });
  });

  it('should return xl for width less than BREAKPOINTS.xxl', () => {
    mockWindowWidth(BREAKPOINTS.xxl - 1);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.xxl - 1, size: 'xl' });
  });

  it('should return xxl for width greater than or equal to BREAKPOINTS.xxl', () => {
    mockWindowWidth(BREAKPOINTS.xxl);
    expect(getDeviceSize()).toEqual({ width: BREAKPOINTS.xxl, size: 'xxl' });
  });
});
