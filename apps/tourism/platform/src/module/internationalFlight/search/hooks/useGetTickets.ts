import { useQuery } from 'react-query';
import { getTicketList } from 'services/internationalFlight/flight';
import { TInternationalPrepareResponse } from 'services/internationalFlight/flight/interface';

export const useGetTickets = (requestIdData: TInternationalPrepareResponse) => {
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
    isError: isTicketError,
  } = useQuery(
    ['getTicketList', requestIdData?.requestId],
    ({ signal }) => getTicketList(requestIdData?.requestId as string, signal),
    {
      enabled: !!requestIdData?.requestId,
      //TODO: don't pending on the interval
      refetchInterval: (data, isError) =>
        !data?.isFinished && isError.state.status !== 'error'
          ? (requestIdData?.pollingOptions?.interval as number) * 1000
          : false,
    },
  );

  return { ticketsData, isTicketsLoading, isTicketsFetching, isTicketError };
};
