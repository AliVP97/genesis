import { AirlineDictionary } from '../../types/api';
import findByAirlineName from './findByAirlineName';

describe('findByAirlineName', () => {
  const dictionary: AirlineDictionary = {
    AA: {
      name: {
        persian: 'American Airlines',
      },
    },
    BA: {
      name: {
        persian: 'British Airways',
      },
    },
  };
  const airlineNames = ['American Airlines', 'British Airways'];

  it('should return true if the airline code is in the dictionary', () => {
    const result = findByAirlineName(
      dictionary,
      airlineNames,
    )({
      operatingAirlineCode: 'AA',
    });
    expect(result).toEqual(true);
  });

  it('should return false if the airline code is not in the dictionary', () => {
    const result = findByAirlineName(
      dictionary,
      airlineNames,
    )({
      operatingAirlineCode: 'CC',
    });
    expect(result).toEqual(false);
  });
});
