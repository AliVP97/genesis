import { FlightDictionary } from 'module/internationalFlight/tickets/ticket/types/FlightDictionary';
import { FlightSegment } from 'module/internationalFlight/tickets/types/api';
import formatDuration from 'module/internationalFlight/tickets/utils/formatDuration';
import { getIataDetails } from '../../../utils/getIataDetails';
import { StopDetails } from '../types/common';

const getDurationDetails = (
  duration: number,
  iataCode: string | undefined,
  dictionary: FlightDictionary,
): string | undefined => {
  if (!duration) {
    return undefined;
  }

  const durationText = formatDuration(duration);
  const cityName = getIataDetails(iataCode, dictionary).cityName;

  return `${durationText} توقف در ${cityName}`;
};

const getStopDetails = (
  flightSegment: FlightSegment,
  dictionary: FlightDictionary,
): StopDetails | undefined => {
  const duration = Number(flightSegment.destinationStopDuration);
  const destinationIata = flightSegment.destination?.iata;
  const durationDetails = getDurationDetails(duration, destinationIata, dictionary);

  if (!durationDetails) {
    return;
  }

  return {
    title: durationDetails,
    baggagePolicy: flightSegment.baggagePolicy,
    transferResponsibility: flightSegment.transferResponsibility,
  };
};

export default getStopDetails;
