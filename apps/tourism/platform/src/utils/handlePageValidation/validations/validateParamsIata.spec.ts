import { validateWithoutContext } from './validateParamsIata';

describe('validateParamsIata', () => {
  it('should return isValid: true when id is single IATA', () => {
    const id = 'AAA';
    const result = validateWithoutContext(id);
    expect(result).toEqual({
      isValid: true,
      props: { isSingleIata: true },
      skipValidations: true,
    });
  });

  it('should return isValid false when id is not valid', () => {
    const id = '123';
    const result = validateWithoutContext(id);
    expect(result).toEqual({ isValid: false });
  });

  it('should return isValid true when id has origin and destination IATA', () => {
    const id = 'IST-THR';
    const result = validateWithoutContext(id);
    expect(result).toEqual({ isValid: true });
  });

  it('should return with correctRoute when id has origin and destination IATA', () => {
    const id = 'THR    -  IST';
    const result = validateWithoutContext(id);
    expect(result).toEqual({ isValid: true, correctRoute: 'THR-IST' });
  });

  it('should return with correctRoute when id has origin and destination IATA', () => {
    const id = 'THR      IST';
    const result = validateWithoutContext(id);
    expect(result).toEqual({ isValid: true, correctRoute: 'THR-IST' });
  });

  it('should return with correctRoute when id has origin and destination IATA', () => {
    const id = 'Thr.....  iST';
    const result = validateWithoutContext(id);
    expect(result).toEqual({ isValid: true, correctRoute: 'THR-IST' });
  });

  it('should return with correctRoute when id has origin only in lowercase', () => {
    const id = 'thR';
    const result = validateWithoutContext(id);
    expect(result).toEqual({
      isValid: true,
      correctRoute: 'THR',
      skipValidations: true,
    });
  });

  it('should return with correctRoute when id has origin only in lowercase', () => {
    const id = 'Tehran';
    const result = validateWithoutContext(id);
    expect(result).toEqual({ isValid: false });
  });
});
