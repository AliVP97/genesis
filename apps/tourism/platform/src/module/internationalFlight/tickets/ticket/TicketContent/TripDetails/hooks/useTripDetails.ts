import { TripDetailProps } from '../TripDetail';
import { FlightDictionary } from '../../../types/FlightDictionary';
import Iata from '../../../types/Iata';
import FlightSegment from '../../../types/FlightSegment';
import Airline from '../../../types/Airline';
import getBaggageDetail from '../utils/getBaggageDetail';
import useDeviceDetect from '../../../../../../../utils/hooks/useDeviceDetect';
import formatDuration from 'module/internationalFlight/tickets/utils/formatDuration';

function getDictionaryItem<T extends Iata | Airline | undefined>(
  code: string | undefined,
  flightDictionary: FlightDictionary,
  key: keyof FlightDictionary,
): T {
  if (!code) {
    return undefined as T;
  }

  const dictionaryItem = flightDictionary[key];

  if (!dictionaryItem) {
    return undefined as T;
  }

  return dictionaryItem[code] as T;
}

function getAirlines(
  segments: FlightSegment[] | undefined,
  flightDictionary: FlightDictionary,
): Airline[] | undefined {
  if (!segments) {
    return undefined;
  }

  const airlines = [];

  for (const x of segments) {
    const airline = getDictionaryItem<Airline>(x.operatingAirlineCode, flightDictionary, 'airline');

    if (airline) {
      airlines.push(airline);
    }
  }

  return airlines;
}

const useTripDetails = (
  props: Omit<TripDetailProps, 'isLeavingFlight' | 'isRoundTrip' | 'hasDiffIata'>,
) => {
  const { isMobile } = useDeviceDetect();
  const { dictionary, data } = props;
  const { origin, destination, segments, duration, stopDetail, stopCount, flightBaggageDetail } =
    data ?? {};

  return {
    isMobile,
    stopCount,
    stopDetail,
    originNextDay: origin?.flightDateTime?.nextDay,
    destinationNextDay: destination?.flightDateTime?.nextDay,
    baggageDetail: getBaggageDetail(flightBaggageDetail),
    durationText: formatDuration(Number(duration)),
    airlines: getAirlines(segments, dictionary),
    originTime: origin?.flightDateTime?.timeFa,
    originIata: getDictionaryItem<Iata>(origin?.iata, dictionary, 'iata'),
    destinationTime: destination?.flightDateTime?.timeFa,
    destinationIata: getDictionaryItem<Iata>(destination?.iata, dictionary, 'iata'),
  };
};

export default useTripDetails;
