import { useMemo } from 'react';

import { TicketsFilterComponentStateType } from 'containers/ticketsFilter/types';
import { MultiSelectButtonsStateMemberType } from 'components/multiSelectButtons/types';
import { BusTickets } from 'services/bus/tickets/interface';

export const useGetStations = (ticketsData: BusTickets) => {
  const stations: TicketsFilterComponentStateType = useMemo(() => {
    if (!ticketsData || ticketsData.length == 0) return [];

    return Array.from(
      new Set(ticketsData.map(({ originStation }) => originStation).filter((x) => x)),
    ).map(
      (originStation): MultiSelectButtonsStateMemberType => ({
        title: originStation || '',
        value: originStation || '',
        isSelected: false,
      }),
    );
  }, [ticketsData]);

  const stationsDestination: TicketsFilterComponentStateType = useMemo(() => {
    if (!ticketsData || ticketsData.length == 0) return [];
    return Array.from(
      new Set(ticketsData.map(({ destinationStation }) => destinationStation).filter((x) => x)),
    ).map(
      (destinationStation): MultiSelectButtonsStateMemberType => ({
        title: destinationStation || '',
        value: destinationStation || '',
        isSelected: false,
      }),
    );
  }, [ticketsData]);

  return {
    stations,
    stationsDestination,
  };
};
