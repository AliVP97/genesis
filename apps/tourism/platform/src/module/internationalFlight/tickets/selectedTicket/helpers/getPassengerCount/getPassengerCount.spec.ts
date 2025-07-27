import getPassengerCount, { FareBreakdownsV2 } from './getPassengerCount';

describe('getPassengerCount', () => {
  it('should return 0 if value is undefined', () => {
    const result = getPassengerCount(undefined);
    expect(result).toBe(0);
  });

  it('should return 0 for empty array', () => {
    const result = getPassengerCount([]);
    expect(result).toBe(0);
  });

  it('should return the sum of all fare breakdowns', () => {
    const fareBreakdowns: FareBreakdownsV2[] = [{ count: 2 }, { count: 1 }, { count: 3 }];
    const result = getPassengerCount(fareBreakdowns);
    expect(result).toBe(6);
  });
});
