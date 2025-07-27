import getBaggageDetail from './getBaggageDetail';
import FlightBaggageDetail from '../types/FlightBaggageDetail';

describe('getBaggageDetail', () => {
  it('should return undefined if detail is undefined', () => {
    const result = getBaggageDetail(undefined);
    expect(result).toEqual({ status: 'no-information' });
  });

  it('should return the formatted string if detail has valid value', () => {
    const detail: FlightBaggageDetail = {
      value: '20',
      unit: 'kg',
    };
    const result = getBaggageDetail(detail);
    expect(result).toEqual({ text: '20 kg', status: 'available' });
  });

  it('should return the undefined if value has zero value', () => {
    const detail: FlightBaggageDetail = {
      value: '0',
    };
    const result = getBaggageDetail(detail);
    expect(result).toEqual({ status: 'not-available' });
  });
});
