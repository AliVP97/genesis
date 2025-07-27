import { ParsedUrlQuery } from 'querystring';
import { ItineraryV2 } from './types/api';

export const intelFilterDuration = (
  tickets: ItineraryV2[],
  query: ParsedUrlQuery,
  key: string,
  isReturning: boolean,
) => {
  if (query[key]) {
    const range = (query[key] as string).split(',').map((durationRange) => +durationRange * 3600);

    return tickets.filter((ticket) => {
      const duration = isReturning
        ? ticket.returningFlight?.duration
        : ticket.leavingFlight?.duration;

      return duration && range[0] <= duration && duration <= range[1];
    });
  }
};

export const intelFilterTime = (query: ParsedUrlQuery, key: string) => {
  if (query[key]) {
    return (query[key] as string).split(',').map((queryTimeRange) => {
      const queryTimeRangeArray = queryTimeRange.split('-').map((timeRange) => +timeRange);
      return {
        from: queryTimeRangeArray[0],
        to: queryTimeRangeArray[1],
      };
    });
  }
};

export const intelGetHour = (date: string) => {
  // @ts-ignore
  const index = [...date].findIndex((el) => el === 'T');
  const start = index + 1;
  const till = index + 3;
  return Number(date.substring(start, till));
};
export const intelGetMinute = (date: string) => {
  // @ts-ignore
  const index = [...date].findIndex((el) => el === ':');
  const start = index + 1;
  const till = index + 3;
  return Number(date.substring(start, till));
};
export const intelDateToTimestamp = (date: string) => {
  const time = new Date(date);
  const unixTime = time.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
  });
  return Math.floor(new Date(unixTime).getTime() / 1000);
};

export const intelFilterStops = (
  query: ParsedUrlQuery,
  tickets: ItineraryV2[],
  key: string,
  isReturning: boolean,
) => {
  const queryStopsRanges = (query[key] as string).split(',').map((item) => +item);
  return tickets.filter((ticket) => {
    const stops = isReturning
      ? Number(ticket.returningFlight?.stopCount)
      : Number(ticket.leavingFlight?.stopCount);
    return queryStopsRanges?.some((queryStopRange) => {
      if (queryStopRange === 3) return stops === 0 || stops === 1 || stops >= 2;
      else return queryStopRange === stops;
    });
  });
};

export const intelSortFast = (tickets: ItineraryV2[]) => {
  return tickets?.sort((a, b) => {
    let duration_a = Number(a.leavingFlight?.duration);
    let duration_b = Number(b.leavingFlight?.duration);
    const isReturning = String(a.tripMode) === 'TRIP_MODE_ROUND_TRIP';
    if (isReturning) {
      duration_a += Number(a.returningFlight?.duration);
      duration_b += Number(b.returningFlight?.duration);
    }
    if (duration_a > duration_b) {
      return 1;
    } else if (duration_a < duration_b) {
      return -1;
    } else {
      return 0;
    }
  });
};
