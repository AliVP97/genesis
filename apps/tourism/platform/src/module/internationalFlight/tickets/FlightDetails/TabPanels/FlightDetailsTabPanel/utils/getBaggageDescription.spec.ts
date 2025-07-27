import getBaggageDescription from './getBaggageDescription';
import { BaggageDetail } from 'module/internationalFlight/tickets/types/api';

describe('getBaggageDescription', () => {
  it('should return "3 KG" when both weight and quantity are available', () => {
    const details: BaggageDetail = { weight: 5, quantity: 3 };
    expect(getBaggageDescription(details)).toBe('5 KG');
  });

  it('should return "4 عدد" when only quantity is available', () => {
    const details: BaggageDetail = { weight: undefined, quantity: 4 };
    expect(getBaggageDescription(details)).toBe('4 عدد');
  });

  it('should return "20 KG" when only weight is available', () => {
    const details: BaggageDetail = { weight: 20, quantity: undefined };
    expect(getBaggageDescription(details)).toBe('20 KG');
  });

  it('should return undefined when neither weight nor quantity is available', () => {
    const details: BaggageDetail = { weight: undefined, quantity: undefined };
    expect(getBaggageDescription(details)).toBeUndefined();
  });
});
