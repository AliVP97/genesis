import { filterTickets } from 'module/train/tickets/filterTickets';
import { TicketList, TrainTicket } from 'module/train/tickets/interface';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { TrainResponse } from 'services/train/tickets/interface';

export const useGetTickets = (ticketsData: TrainResponse) => {
  const { query } = useRouter();
  const [selectedTickets, setSelectedTickets] = useState<TrainTicket[] | []>([]);
  const tickets = useMemo(() => {
    if (!ticketsData?.trainLists) return [];

    if (!ticketsData?.trainLists[0]?.trainList) return [];

    const trainList = !!(selectedTickets.length && query.returningDate)
      ? ticketsData?.trainLists[1]
        ? ticketsData?.trainLists[1].trainList
        : []
      : ticketsData?.trainLists[0].trainList
        ? ticketsData?.trainLists[0].trainList
        : [];

    const result =
      trainList && (trainList as TicketList)?.filter((item) => item.availableSeatCount !== 0);
    const resultWithNoCapacity = (trainList as TicketList)?.filter(
      (item) => item.availableSeatCount == 0,
    );
    const trainListResult = [...result!, ...resultWithNoCapacity];

    if (!trainListResult?.length) return [];
    return filterTickets(trainListResult, query);
  }, [query, ticketsData, selectedTickets.length]);

  return {
    tickets,
    selectedTickets,
    setSelectedTickets,
  };
};
