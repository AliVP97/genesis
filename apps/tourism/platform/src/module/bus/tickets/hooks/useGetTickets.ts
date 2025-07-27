import { useMemo } from 'react';

import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { BusPrepareResponse } from 'services/bus/order/interface';
import { getBusTicketList } from 'services/bus/tickets';
import { BusTickets } from 'services/bus/tickets/interface';
import { filterTickets } from '../filterTickets';

export const useGetTickets = (requestIdData: BusPrepareResponse) => {
  const { query } = useRouter();

  const {
    data: ticketsData,
    isLoading: busTicketsLoading,
    isFetching,
    error: getBusListError,
  } = useQuery(['getBusTicketList', requestIdData?.requestId as string], getBusTicketList, {
    enabled: !!requestIdData?.requestId,
    refetchInterval: (data, isError) =>
      !data?.isFinished && isError.state.status !== 'error'
        ? (requestIdData?.secondsBetweenRequests as number) * 1000
        : false,
  });

  const coveragePercent = ticketsData?.coveragePercent;
  const filtrableTicketData = ticketsData?.busInfo;
  const isFinished = ticketsData?.isFinished || false;
  const fullCapacity = ticketsData?.isCapacityFull;

  const tickets = useMemo(() => {
    if (!ticketsData?.busInfo) return [];
    const busList = ticketsData?.busInfo ? ticketsData.busInfo : [];
    const result = busList && (busList as BusTickets)?.filter((item) => item.remainingSeats !== 0);
    const resultWithNoCapacity = (busList as BusTickets)?.filter(
      (item) => item.remainingSeats == 0,
    );
    const busListResult = [...result!, ...resultWithNoCapacity!];

    if (!busListResult?.length) return [];
    return filterTickets(busListResult, query);
  }, [query, ticketsData]);

  return {
    tickets,
    isFinished,
    coveragePercent,
    filtrableTicketData,
    busTicketsLoading,
    isFetching,
    getBusListError,
    fullCapacity,
  };
};
