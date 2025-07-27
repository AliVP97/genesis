import getQueryWithoutFilterKeys from './getQueryWithoutFilterKeys';
import { QueryType } from 'utils/helpers/global';

describe('getQueryWithoutFilterKeys', () => {
  it('should return query without filter keys', () => {
    const query: QueryType = {
      priceRange: '',
      departureDuration: '22',
      departureTime: '1',
      departureStops: '2',
      airlines: '1',
      ticketType: '22',
    };
    const result = getQueryWithoutFilterKeys(query);
    expect(result).toEqual({});
  });

  it('should return query with raw keys', () => {
    const query: QueryType = {
      priceRange: '',
      departureDuration: '22',
      departureTime: '1',
      departureStops: '2',
      airlines: '1',
      ticketType: '22',
      test: 'test',
    };
    const result = getQueryWithoutFilterKeys(query);
    expect(result).toEqual({ test: 'test' });
  });
});
