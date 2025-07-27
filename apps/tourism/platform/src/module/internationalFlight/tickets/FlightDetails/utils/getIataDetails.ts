import { FlightDictionary } from '../../ticket/types/FlightDictionary';
import { IATAEntry } from '../../types/api';
import { Iata } from '../types/common';

const DEFAULT_IATA_DETAILS: Iata = {
  iataName: '',
  cityName: '',
  iataCode: '',
};

export const getIataDetails = (code: string | undefined, dictionary: FlightDictionary): Iata => {
  if (!code) {
    return DEFAULT_IATA_DETAILS;
  }

  for (const dictionaryKey in dictionary.iata) {
    if (dictionaryKey === code) {
      const iataEntry: IATAEntry = dictionary.iata[dictionaryKey];

      return {
        iataName: iataEntry.name?.persian ?? '',
        cityName: iataEntry.city?.name?.persian ?? '',
        iataCode: iataEntry.code ?? '',
      };
    }
  }

  return DEFAULT_IATA_DETAILS;
};
