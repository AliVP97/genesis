import { components } from 'types/international-flight';
import { FlightV2, ItineraryV2 } from '../types/api';

type TripTypeMode = 'earliestTime' | 'recentTime';

type TripMode = components['schemas']['InternationalFlightPb.TripMode'] | undefined | string;

const TRIP_MODES = {
  TRIP_MODE_ONEWAY: 'TRIP_MODE_ONEWAY',
  TRIP_MODE_UNDEFINED: 'TRIP_MODE_UNDEFINED',
  TRIP_MODE_ROUND_TRIP: 'TRIP_MODE_ROUND_TRIP',
};

function getFlightOriginTime(flight: FlightV2 | undefined): number {
  const dateTime = flight?.origin?.flightDateTime;

  if (!dateTime) {
    return Date.now();
  }

  return new Date(`${dateTime?.dateEn} ${dateTime?.timeEn}`).getTime();
}

export const isRoundTrip = (tripMode: TripMode) => tripMode === TRIP_MODES.TRIP_MODE_ROUND_TRIP;

const sortTicketsByTripTime = (tickets: ItineraryV2[], mode: TripTypeMode): ItineraryV2[] => {
  if (!tickets) {
    return [];
  }

  const orderFactor = mode === 'earliestTime' ? 1 : -1;
  const roundTrip = isRoundTrip(tickets[0]?.tripMode);
  const sortedTickets = JSON.parse(JSON.stringify(tickets)) as ItineraryV2[];

  sortedTickets.sort((current, next) => {
    const currentLeavingTime = getFlightOriginTime(current.leavingFlight);
    const nextLeavingTime = getFlightOriginTime(next.leavingFlight);

    if (!roundTrip) {
      return (currentLeavingTime - nextLeavingTime) * orderFactor;
    }

    if (currentLeavingTime !== nextLeavingTime) {
      return (currentLeavingTime - nextLeavingTime) * orderFactor;
    }

    const currentReturningTime = getFlightOriginTime(current.returningFlight);
    const nextReturningTime = getFlightOriginTime(next.returningFlight);

    return (currentReturningTime - nextReturningTime) * orderFactor;
  });

  return sortedTickets;
};

export default sortTicketsByTripTime;
