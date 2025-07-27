import getLastInternationalFlightSearches, {
  InternationalFlightSearch,
} from './getLastInternationalFlightSearches';

describe('getLastInternationalFlightSearch', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return undefined when localStorage is empty', () => {
    const result = getLastInternationalFlightSearches();
    expect(result).toBeUndefined();
  });

  it('should return undefined when localStorage contains invalid JSON', () => {
    localStorage.setItem('international_flight_last_search', 'invalid json');
    const result = getLastInternationalFlightSearches();
    expect(result).toBeUndefined();
  });

  it('should return parsed data when localStorage contains valid JSON', () => {
    const mockData: InternationalFlightSearch[] | never[] = [
      {
        origin: {
          value: 'test',
          city: '',
        },
        destination: {
          value: 'test',
          city: '',
        },
        passenger: {
          adult: 1,
          child: 0,
          infant: 0,
        },
        departureDate: '2023-01-01',
        returningDate: '2023-01-02',
        cabinType: 'CABIN_TYPE_BUSINESS',
        calendarSystem: 'jalali',
        sort: 'price',
      },
    ];
    localStorage.setItem('international_flight_last_search', JSON.stringify(mockData));
    const result = getLastInternationalFlightSearches();
    expect(result).toEqual(mockData);
  });

  it('should return undefined when parsed data does not match the schema', () => {
    const invalidData = [{ invalidField: 'test' }];
    localStorage.setItem('international_flight_last_search', JSON.stringify(invalidData));
    const result = getLastInternationalFlightSearches();
    expect(result).toBeUndefined();
  });
});
