import { FlightDictionary } from 'module/internationalFlight/tickets/ticket/types/FlightDictionary';
import { BaggageDetail, FlightSegment } from 'module/internationalFlight/tickets/types/api';
import { getIataDetails } from '../../../utils/getIataDetails';
import { TripOverviewProps } from '../TripOverview';
import formatDuration from 'module/internationalFlight/tickets/utils/formatDuration';
import { components } from 'types/international-flight';
import getBaggageDescription from './getBaggageDescription';

type FlightEndpoint = components['schemas']['InternationalFlightPb.FlightEndpoint'];

const getIataTime = (endPoint: FlightEndpoint | undefined) =>
  endPoint?.persianDate?.dateTimeString ?? '';

const getTripOverview = (
  flightSegment: FlightSegment,
  dictionary: FlightDictionary,
): TripOverviewProps => {
  const originIata = getIataDetails(flightSegment.origin?.iata, dictionary);
  const destinationIata = getIataDetails(flightSegment.destination?.iata, dictionary);
  const baggageDetails = flightSegment.baggageInfos?.find(
    (info) => info.baggageType === 'CheckedBag',
  ) as BaggageDetail;

  return {
    originIata,
    destinationIata,
    nextDay: Boolean(flightSegment.nextDay),
    originTime: getIataTime(flightSegment.origin),
    flightNumber: flightSegment.flightNumber ?? '',
    aircraftCode: flightSegment.aircraftCode ?? '',
    duration: formatDuration(flightSegment.duration, true),
    destinationTime: getIataTime(flightSegment.destination),
    baggageDescription: getBaggageDescription(baggageDetails),
  };
};

export default getTripOverview;
