import { useMemo } from 'react';
import { definitions } from 'types/domestic-flight-aggregator';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import { GetDomesticTicketResponse } from 'services/domestic/flight/interface';
import { useRouter } from 'next/router';

export type Airline = { code?: string; name?: string; price?: number };

export const useGetAirlines = (selected: TicketType | null, data: GetDomesticTicketResponse) => {
  const { query } = useRouter();

  const airlines = useMemo(() => {
    if (!data?.flightQueryResult) return [];

    let flightList:
      | {
          flightList?: definitions['domesticflightaggregatorFlightInfo'][];
          calendarData?: definitions['aggregatorCalenderData'][];
          alert?: boolean;
        }
      | never[] = [];

    if (query?.returningDate && selected) {
      // If returningDate exists and selected is truthy, use flightQueryResult[1] if available
      flightList = data?.flightQueryResult[1] ?? [];
    } else {
      // Otherwise, use flightQueryResult[0]
      flightList = data?.flightQueryResult[0] ?? [];
    }

    const airlinesList = flightList?.flightList
      ? flightList.flightList.map((ticket) => ({
          ...ticket.airline,
          price: ticket.price,
        }))
      : [];

    return airlinesList.reduce((acc, airline: Airline) => {
      const index = acc.find((el) => el.code! === airline.code);
      if (index) {
        acc = acc.map((el) => {
          if (el.code! === airline.code && airline.price! < el.price! && airline.price !== 0)
            return airline;
          return el;
        });
      } else {
        acc.push(airline);
      }
      return acc;
    }, [] as Airline[]);
  }, [data, selected]);
  return {
    airlines,
  };
};
