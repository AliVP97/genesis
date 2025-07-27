import { FlightDictionary } from 'module/internationalFlight/tickets/ticket/types/FlightDictionary';
import { Flight } from 'module/internationalFlight/tickets/types/api';
import { getIataDetails } from '../../utils/getIataDetails';

const formatIataCityRoute = (
  flightSegment: Flight | undefined,
  dictionary: FlightDictionary,
): string => {
  if (!flightSegment) {
    return '';
  }

  const originCity = getIataDetails(flightSegment.origin?.iata, dictionary).cityName;
  const destinationCity = getIataDetails(flightSegment.destination?.iata, dictionary).cityName;

  return `${originCity} به ${destinationCity}`;
};

export default formatIataCityRoute;
