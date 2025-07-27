import { useMemo } from 'react';

import { MultiSelectButtonsStateMemberType } from 'components/multiSelectButtons/types';
import { TicketsFilterComponentStateType } from 'containers/ticketsFilter/types';
import { BusTickets } from 'services/bus/tickets/interface';

export const useGetBusTypes = (ticketsData: BusTickets) => {
  const busTypes: TicketsFilterComponentStateType = useMemo(() => {
    if (!ticketsData || ticketsData.length == 0) return [];

    return Array.from(new Set(ticketsData.map(({ busType }) => busType).filter((x) => x))).map(
      (busType): MultiSelectButtonsStateMemberType => ({
        title: busType || '',
        value: busType || '',
        isSelected: false,
      }),
    );
  }, [ticketsData]);
  return {
    busTypes,
  };
};
