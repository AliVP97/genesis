import { ParsedUrlQuery } from 'querystring';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import {
  intelFilterDuration,
  intelFilterStops,
  intelFilterTime,
  intelGetHour,
  intelSortFast,
} from './helper';
import { ItineraryV2 } from './types/api';
import sortTicketsByTripTime from './utils/sortTicketsByTripTime';
import flatSegments from './utils/flatSegments';
import findByAirlineName from './utils/findByAirlineName';

export const filterTickets = (
  tickets: ItineraryV2[],
  query: ParsedUrlQuery,
  dictionary: TDictionary,
) => {
  if (query.priceRange) {
    const queryPriceRange = (query.priceRange as string)
      .split(',')
      .map((priceRange) => +priceRange);
    tickets = tickets.filter(
      (ticket) =>
        queryPriceRange[0] <= Number(ticket?.priceInfo?.price) &&
        Number(ticket?.priceInfo?.price) <= queryPriceRange[1],
    );
  }

  if (query.departureDuration) {
    tickets = intelFilterDuration(tickets, query, 'departureDuration', false)!;
  }

  if (query.returningDuration) {
    tickets = intelFilterDuration(tickets, query, 'returningDuration', true)!;
  }

  if (query.departureTime) {
    const queryDepartureRanges = intelFilterTime(query, 'departureTime');
    tickets = tickets.filter((ticket) => {
      const ticketTime = intelGetHour(String(ticket.leavingFlight?.origin?.flightDateTime?.timeFa));
      return queryDepartureRanges?.some(
        (queryDepartureRange) =>
          queryDepartureRange.from <= ticketTime && ticketTime <= queryDepartureRange.to,
      );
    });
  }

  if (query.returningTime) {
    const queryReturningRanges = intelFilterTime(query, 'returningTime');
    tickets = tickets.filter((ticket) => {
      const ticketTime = intelGetHour(
        String(ticket?.returningFlight?.origin?.flightDateTime?.timeFa),
      );
      return queryReturningRanges?.some(
        (queryReturningRange) =>
          queryReturningRange.from <= ticketTime && ticketTime <= queryReturningRange.to,
      );
    });
  }

  if (query.departureStops) {
    tickets = intelFilterStops(query, tickets, 'departureStops', false);
  }

  if (query.returningStops) {
    tickets = intelFilterStops(query, tickets, 'returningStops', true);
  }

  if (query.airlines) {
    const airlineNames = (query.airlines as string).split(',');

    tickets = tickets.filter((ticket) =>
      flatSegments(ticket).some(findByAirlineName(dictionary.airlineDictionary, airlineNames)),
    );
  }

  if (query.ticketType) {
    const queryTicketTypes = (query.ticketType as string).split(',');
    tickets = tickets.filter((ticket) => {
      const isCharter = String(ticket?.isCharter);
      return queryTicketTypes?.some((queryTicketType) => {
        return queryTicketType === isCharter;
      });
    });
  }

  if (query.sort) {
    if (query.sort === 'lowPrice') {
      tickets = tickets.sort((a, b) => +a!.priceInfo!.price! - +b!.priceInfo!.price!);
    } else if (query.sort === 'highPrice') {
      tickets = tickets.sort((a, b) => +b!.priceInfo!.price! - +a!.priceInfo!.price!);
    } else if (query.sort === 'earliestTime') {
      tickets = sortTicketsByTripTime(tickets, 'earliestTime');
    } else if (query.sort === 'recentTime') {
      tickets = sortTicketsByTripTime(tickets, 'recentTime');
    } else if (query.sort === 'fast') {
      tickets = intelSortFast(tickets);
    }
  }

  const result = tickets;
  return [...result];
};
