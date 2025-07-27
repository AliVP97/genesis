import { TicketType } from 'module/flights/tickets/ticket/interface';
import { FilterType } from 'containers/filter/filterTicket/interface';
import { ParsedUrlQuery } from 'querystring';

export const parseQuery = (query: ParsedUrlQuery): FilterType => {
  return {
    airlines: query.airlines ? (query?.airlines as string)?.split(',') : undefined,
    stops: query.stops ? (query?.stops as string)?.split(',') : undefined,
    backward: query.backward ? (query?.backward as string)?.split(',') : undefined,
    toward: query.toward ? (query?.toward as string)?.split(',') : undefined,
    price: query.price
      ? {
          min: +(query?.price as string)?.split(',')[0],
          max: +(query?.price as string)?.split(',')[1],
        }
      : undefined,

    ticketType: query?.ticketType ? [query?.ticketType as string] : undefined,

    flightClass: query?.flightClass ? [query?.flightClass as string] : undefined,
    availableFlights: query?.availableFlights ? [String(query?.availableFlights)] : undefined,
  };
};

export const submitFilter = (query: ParsedUrlQuery, result: TicketType[]) => {
  let ticketResult = [...result];
  if (query.stops) {
    const numberOfStops = query.stops.toString().split(',');
    ticketResult = ticketResult?.filter((ticket) =>
      numberOfStops.includes(ticket.numberOfStops!.toString()),
    );
  }
  if (query.toward) {
    const arriveTime = query.toward.toString().split(',');
    ticketResult = ticketResult?.filter((ticket) => {
      const date = new Date((ticket?.departure?.date as number) * 1000).getHours();

      let flag = false;
      arriveTime.forEach((el) => {
        const period = el.split('-');
        if (date >= +period[0] && date < +period[1]) {
          flag = true;
        }
      });
      return flag;
    });
  }
  if (query.backward) {
    {
      const arriveTime = query.backward.toString().split(',');
      ticketResult = ticketResult?.filter((ticket) => {
        const date = new Date((ticket?.departure?.date as number) * 1000).getHours();

        let flag = false;
        arriveTime.forEach((el) => {
          const period = el.split('-');
          if (date >= +period[0] && date < +period[1]) {
            flag = true;
          }
        });
        return flag;
      });
    }
  }
  if (query.price) {
    const pricePeriod = query.price
      .toString()
      .split(',')
      .map((el) => +el);

    ticketResult = ticketResult.filter(
      (ticket) =>
        (ticket.price! >= pricePeriod[0] && ticket.price! <= pricePeriod[1]) ||
        ticket.remainingSeats === 0,
    );
  }
  if (query.airlines) {
    const airlines = query.airlines.toString().split(',');
    ticketResult = ticketResult?.filter((ticket) =>
      ticket.airline?.code ? airlines.includes(ticket.airline?.code) : false,
    );
  }
  if (query.sort) {
    if (query.sort === 'lowPrice') {
      ticketResult = ticketResult?.sort((a, b) => a.price! - b.price!);
    } else if (query.sort === 'highPrice') {
      ticketResult = ticketResult?.sort((a, b) => b.price! - a.price!);
    } else if (query.sort === 'earliestTime') {
      ticketResult = ticketResult?.sort((a, b) => {
        //@ts-ignore
        if (a?.departure?.date > b.departure.date) {
          return 1;
          //@ts-ignore
        } else if (a.departure.date < b.departure.date) {
          return -1;
        } else {
          return 0;
        }
      });
    } else if (query.sort === 'recentTime') {
      ticketResult = ticketResult?.sort((a, b) => {
        //@ts-ignore
        if (a?.departure?.date < b.departure.date) {
          return 1;
          //@ts-ignore
        } else if (a.departure.date > b.departure.date) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }
  if (query.ticketType) {
    const toBoolean = (ticketType: string) => (ticketType === 'charter' ? true : false);
    ticketResult = ticketResult?.filter((item) => {
      return item.isCharter === toBoolean(query.ticketType as string);
    });
  }
  if (query.flightClass) {
    ticketResult = ticketResult?.filter((item) => {
      return item.flightClass === query.flightClass;
    });
  }
  if (query.availableFlights) {
    ticketResult = ticketResult?.filter((item) => {
      return item.remainingSeats !== 0;
    });
  }
  // PUT ZERO(0) REAMING SEATS TICKET END OF LIST
  ticketResult = ticketResult?.sort(function (x, y) {
    return !!x.remainingSeats === !!y.remainingSeats ? 0 : !!x.remainingSeats ? -1 : 1;
  });

  return ticketResult;
};
