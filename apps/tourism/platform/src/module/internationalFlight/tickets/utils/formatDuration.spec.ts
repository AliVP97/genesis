import formatDuration from './formatDuration';

describe('formatDuration', () => {
  test('should return an empty string for undefined input', () => {
    expect(formatDuration(undefined)).toBe('');
  });

  test('should return an empty string for NaN input', () => {
    expect(formatDuration(NaN)).toBe('');
  });

  test('should return an empty string for zero duration', () => {
    expect(formatDuration(0)).toBe('');
  });

  test('should format duration with only hours', () => {
    expect(formatDuration(7200)).toBe('2 ساعت'); // 2 hours
  });

  test('should format duration with both hours and minutes', () => {
    expect(formatDuration(7500)).toBe('2 ساعت و 5 دقیقه'); // 2 hours and 5 minutes
  });

  test('should handle edge case of exactly one hour', () => {
    expect(formatDuration(3599)).toBe('59 دقیقه');
  });

  test('should handle 33 minutes without determine hours', () => {
    expect(formatDuration(2000)).toBe('33 دقیقه');
  });

  test('should handle edge case of exactly one hour', () => {
    expect(formatDuration(3600)).toBe('1 ساعت');
  });

  test('should handle large durations', () => {
    expect(formatDuration(3661)).toBe('1 ساعت و 1 دقیقه'); // 1 hour, 1 minute, and extra seconds ignored
  });

  test('should handle other type of output', () => {
    expect(formatDuration(7261, true)).toEqual({
      hours: '2 ساعت',
      minutes: '1 دقیقه',
    });
  });
});
