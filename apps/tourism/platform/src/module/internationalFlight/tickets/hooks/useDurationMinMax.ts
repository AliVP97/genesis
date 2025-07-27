import { useMemo } from 'react';
import { AvailabilityListResponseV2 } from '../types/api';

export const useDurationMinMax = (ticketsData: AvailabilityListResponseV2) => {
  const durationMinMax = useMemo(() => {
    const result = [{ min: 0, max: 0 }];

    ticketsData?.itineraries?.forEach((ticket, ticketIndex) => {
      // leave flight
      if (ticket.leavingFlight?.duration) {
        const ticketDuration = +ticket.leavingFlight?.duration;

        if (ticketDuration > 0) {
          if (ticketIndex === 0) {
            result[0].min = ticketDuration;
            result[0].max = ticketDuration;
          } else
            ticketDuration < result[0].min
              ? (result[0].min = ticketDuration)
              : ticketDuration > result[0].max && (result[0].max = ticketDuration);
        }
      }

      // return flight
      if (ticket.returningFlight?.duration) {
        const ticketDuration = +ticket.returningFlight?.duration;
        if (ticketDuration > 0) {
          if (result[1]) {
            ticketDuration < result[1].min
              ? (result[1].min = ticketDuration)
              : ticketDuration > result[1].max && (result[1].max = ticketDuration);
          } else result.push({ min: ticketDuration, max: ticketDuration });
        }
      }
    });

    const cleanResult = result.map((item) => {
      return {
        min: Math.floor(item.min / 3600),
        max: Math.ceil(item.max / 3600),
      };
    });

    return cleanResult;
  }, [ticketsData]);

  return {
    durationMinMax,
  };
};
