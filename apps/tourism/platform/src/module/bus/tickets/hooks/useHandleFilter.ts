import { useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { RoundedButtonStateType } from 'components/roundedButton/types';
import { CompaniesListStateMemberType } from 'containers/companiesList/types';
import { TicketsFilterChangeEventType } from 'containers/ticketsFilter/types';
import { createTicketsFilterState } from 'containers/ticketsFilter/utils';
import { RangeControlStateMemberType } from 'components/rangeControl';
import { QueryType } from 'utils/helpers/global';
import { BusTickets } from 'services/bus/tickets/interface';
import { useCreateQueryAndPush } from '../../tickets/hooks/useCreateQueryAndPush';
import { useInitTicketsFilterState } from './useInitTicketsFilterState';

export const useHandleFilter = (ticketsData: BusTickets) => {
  const { query } = useRouter();
  const { initTicketsFilterState } = useInitTicketsFilterState(ticketsData);

  const { createQueryAndPush } = useCreateQueryAndPush();

  const [bottomSheetIsVisible, setBottomSheetIsVisible] = useState<boolean>(false);
  const [ticketsFilterState, setTicketsFilterState] = useState(
    createTicketsFilterState(query as QueryType, initTicketsFilterState),
  );
  const bottomSheetSubmitted = useRef(false);

  const handleTicketsFilterIconClick = () => {
    setBottomSheetIsVisible(true);
  };

  const handleTicketsFilterChange = (e: TicketsFilterChangeEventType) => {
    setTicketsFilterState(e.state);
  };

  const handleDesktopTicketsFilterChange = (e: TicketsFilterChangeEventType) => {
    setTicketsFilterState(e.state);
    createQueryAndPush(query as QueryType, e.state);
  };

  const handleTicketsFilterChipsChange = (e: TicketsFilterChangeEventType) => {
    setTicketsFilterState(e.state);
    createQueryAndPush(query as QueryType, e.state);
  };

  const handleTicketsFilterSubmit = () => {
    setBottomSheetIsVisible(false);
    bottomSheetSubmitted.current = true;
    createQueryAndPush(query as QueryType, ticketsFilterState);
  };

  const handleRemoveTicketsFilterClick = () => {
    setTicketsFilterState(initTicketsFilterState);
  };

  const handleDesktopRemoveTicketsFilterClick = () => {
    setTicketsFilterState(initTicketsFilterState);
    createQueryAndPush(query as QueryType, initTicketsFilterState);
  };

  const ticketsFilterStateBeforeBottomSheetOpen = useRef(ticketsFilterState);

  const filtersLength = useMemo(() => {
    return ticketsFilterState.reduce((prevValue: number, { component: { state } }) => {
      // @ts-ignore
      const rowCount = state.reduce(
        (
          count: number,
          currValue:
            | RangeControlStateMemberType
            | RoundedButtonStateType
            | CompaniesListStateMemberType,
        ) => {
          if ('isSelected' in currValue) {
            // Count this two filter type = ( MultiSelectButtonsStateType | CompaniesListStateType ) not RangeControlStateType
            return count + Number(currValue?.isSelected);
          }

          return prevValue;
        },
        0,
      );

      return prevValue + rowCount;
    }, 0);
  }, [ticketsFilterState]);

  return {
    handleTicketsFilterIconClick,
    handleTicketsFilterChange,
    handleDesktopTicketsFilterChange,
    handleTicketsFilterChipsChange,
    handleTicketsFilterSubmit,
    handleRemoveTicketsFilterClick,
    handleDesktopRemoveTicketsFilterClick,
    bottomSheetIsVisible,
    setBottomSheetIsVisible,
    ticketsFilterState,
    setTicketsFilterState,
    ticketsFilterStateBeforeBottomSheetOpen,
    bottomSheetSubmitted,
    filtersLength,
  };
};
