//
// This code should be written per service since each service data structure-
// response is different.

import { ParsedUrlQuery } from 'querystring';
import { TicketType } from './interface';

export const filterTickets = (tickets: TicketType[], query: ParsedUrlQuery) => {
  if (query.fareRange) {
    const queryFareRange = (query.fareRange as string).split(',').map((fare) => +fare);
    tickets = tickets.filter(
      (ticket) => queryFareRange[0] <= +ticket.fare! && +ticket.fare! <= queryFareRange[1],
    );
  }
  if (query.departureTimeRanges) {
    const queryDepartureTimeRanges = (query.departureTimeRanges as string)
      .split(',')
      .map((queryDepartureTimeRange) => {
        const queryDepartureTimeRangeArray = queryDepartureTimeRange
          .split('-')
          .map((item) => +item);
        return {
          from: queryDepartureTimeRangeArray[0],
          to: queryDepartureTimeRangeArray[1],
        };
      });
    tickets = tickets.filter((ticket) => {
      const departureDate = new Date(Number(ticket.departureDate) * 1000);
      const ticketTime =
        departureDate.getHours() +
        Math.round((departureDate.getMinutes() / 60 + Number.EPSILON) * 10) / 10;

      return queryDepartureTimeRanges.some(
        (queryDepartureTimeRange) =>
          queryDepartureTimeRange.from <= ticketTime && ticketTime <= queryDepartureTimeRange.to,
      );
    });
  }
  if (query.companyNames) {
    const queryCompanyNames = (query.companyNames as string).split(',');
    tickets = tickets.filter(
      (ticket) => ticket.companyName && queryCompanyNames.includes(ticket.companyName),
    );
  }
  if (query.wagonTypes) {
    const queryWagonTypes = (query.wagonTypes as string).split(',');
    tickets = tickets.filter(
      (ticket) => ticket.wagonType && queryWagonTypes.includes(ticket.wagonType),
    );
  }
  if (query.sort) {
    if (query.sort === 'lowPrice') {
      tickets = tickets.sort((a, b) => +a.fare! - +b.fare!);
    } else if (query.sort === 'highPrice') {
      tickets = tickets.sort((a, b) => +b.fare! - +a.fare!);
    } else if (query.sort === 'earliestTime') {
      tickets = tickets.sort((a, b) => {
        //@ts-ignore
        if (a?.departureDate > b.departureDate) {
          return 1;
        } else if (a.departureDate! < b.departureDate!) {
          return -1;
        } else {
          return 0;
        }
      });
    } else if (query.sort === 'recentTime') {
      tickets = tickets.sort((a, b) => {
        //@ts-ignore
        if (a?.departureDate < b.departureDate) {
          return 1;
        } else if (a.departureDate! > b.departureDate!) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  if (query.selectability) {
    tickets = tickets?.filter((ticket) => ticket.availableSeatCount !== 0);
  }

  const result = tickets.filter((a) => a.availableSeatCount !== 0);
  const resultWithDisables = tickets.filter((a) => a.availableSeatCount === 0);

  return [...result, ...resultWithDisables];
};
