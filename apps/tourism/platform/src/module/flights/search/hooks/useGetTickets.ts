import { useQuery } from 'react-query';
import { getTicketList } from 'services/domestic/flight';
import { GetSearchIdResponse } from 'services/domestic/flight/interface';

export const useGetTickets = (requestIdData: GetSearchIdResponse) => {
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
  } = useQuery(
    ['getTicketList'],
    ({ signal }) => getTicketList(requestIdData?.requestID as string, signal),
    {
      enabled: !!requestIdData?.requestID,
      refetchInterval: (data, isError) =>
        !data?.finished && isError.state.status !== 'error'
          ? (requestIdData?.secondsBetweenRequests as number) * 1000
          : false,
    },
  );
  return {
    ticketsData,
    isTicketsLoading,
    isTicketsFetching,
  };
};
