import { useMemo } from 'react';
import { components } from 'types/international-flight';
import { AvailabilityListResponseV2 } from '../types/api';

type Itinerary = components['schemas']['InternationalFlightPb.Itinerary'];

export const usePriceMinMax = (ticketsData: AvailabilityListResponseV2) => {
  const tickets = ticketsData?.itineraries;

  const priceMinMax = useMemo(() => {
    if (!tickets?.length) {
      return { min: 0, max: 0 };
    }

    const newTickets = JSON.parse(JSON.stringify(tickets)) as Itinerary[];
    newTickets.sort(
      (firstTicket, secondTicket) =>
        (firstTicket.priceInfo?.price ?? 0) - (secondTicket.priceInfo?.price ?? 0),
    );

    return {
      min: Number(newTickets[0]?.priceInfo!.price) || 0,
      max: Number(newTickets[newTickets!.length! - 1]?.priceInfo!.price) || 0,
    };
  }, [tickets]);

  return { priceMinMax };
};
