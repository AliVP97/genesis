import { FlightDictionary } from '../../ticket/types/FlightDictionary';
import { Airline } from '../types/common';

const DEFAULT_AIRLINE: Airline = {
  code: '',
  name: '',
  logo: '',
};

const getAirlineDetails = (code: string | undefined, dictionary: FlightDictionary): Airline => {
  if (!code) {
    return DEFAULT_AIRLINE;
  }

  for (const dictionaryKey in dictionary.airline) {
    if (dictionaryKey === code) {
      const airlineEntry = dictionary.airline[dictionaryKey];

      return {
        code: airlineEntry.code ?? '',
        name: airlineEntry.name?.english ?? '',
        logo: airlineEntry.logoUri ?? '',
      };
    }
  }

  return DEFAULT_AIRLINE;
};

export default getAirlineDetails;
