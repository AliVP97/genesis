import { ParsedUrlQuery } from 'querystring';
import { BusTickets } from 'services/bus/tickets/interface';

export const filterTickets = (tickets: BusTickets, query: ParsedUrlQuery) => {
  if (query.fareRange) {
    const queryFareRange = (query.fareRange as string).split(',').map((fare) => +fare);
    tickets = tickets?.filter(
      (ticket) =>
        // eslint-disable-next-line  @typescript-eslint/no-non-null-asserted-optional-chain
        queryFareRange[0] <= +ticket?.price! &&
        // eslint-disable-next-line  @typescript-eslint/no-non-null-asserted-optional-chain
        +ticket?.price! <= queryFareRange[1],
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
    tickets = tickets?.filter((ticket) => {
      const ticketTime = new Date(Number(ticket?.departureDate) * 1000).getHours();
      return queryDepartureTimeRanges.some(
        (queryDepartureTimeRange) =>
          queryDepartureTimeRange.from <= ticketTime && ticketTime <= queryDepartureTimeRange.to,
      );
    });
  }

  if (query.stations) {
    const stations = query.stations.toString().split(',');
    tickets = tickets?.filter((ticket) => {
      return stations.some((station) => station == ticket.originStation);
    });
  }

  if (query['stations-destination']) {
    const stations = query['stations-destination'].toString().split(',');

    tickets = tickets?.filter((ticket) => {
      return stations.some((station) => station == ticket.destinationStation);
    });
  }

  if (query.busTypes) {
    const busTypes = query.busTypes.toString().split(',');
    tickets = tickets?.filter((ticket) => {
      return busTypes.some((busType) => busType == ticket.busType);
    });
  }
  if (query.companyNames) {
    const companyNames = query.companyNames.toString().split(',');
    tickets = tickets?.filter((ticket) => {
      return companyNames.some((companyType) => companyType == ticket.companyName);
    });
  }

  if (query.sort) {
    if (query.sort === 'lowPrice') {
      tickets = tickets?.sort((a, b) => +a.price! - +b.price!);
    } else if (query.sort === 'highPrice') {
      tickets = tickets?.sort((a, b) => +b.price! - +a.price!);
    } else if (query.sort === 'earliestTime') {
      tickets = tickets?.sort((a, b) => {
        if (a?.departureDate && b?.departureDate)
          return a?.departureDate.localeCompare(b?.departureDate) || +a.price! - +b.price!;
        return 0;
      });
    } else if (query.sort === 'recentTime') {
      tickets = tickets?.sort((a, b) => {
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
    tickets = tickets?.filter((ticket) => ticket.remainingSeats !== 0);
  }

  const result = tickets?.filter((a) => a.remainingSeats !== 0);
  const resultWithDisables = tickets?.filter((a) => a.remainingSeats === 0);
  return [...result!, ...resultWithDisables!];
};
