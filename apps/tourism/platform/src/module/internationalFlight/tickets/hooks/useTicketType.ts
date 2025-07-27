import { useMemo } from 'react';
import { ItineraryV2 } from '../types/api';

export const useTicketType = (itineraries: ItineraryV2[]) => {
  const tickets = itineraries;
  const isCharter = useMemo(() => {
    if (!tickets?.length) {
      return false;
    }

    return tickets.some((ticket) => ticket.isCharter);
  }, [itineraries]);

  return { isCharter };
};
