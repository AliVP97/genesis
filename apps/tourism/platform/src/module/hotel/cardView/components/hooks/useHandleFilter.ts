import { TicketsFilterChangeEventType } from 'containers/ticketsFilter/types';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { QueryType } from 'utils/helpers/global';
import { createTicketsFilterState } from 'containers/ticketsFilter/utils';
import { useInitTicketsFilterState } from './useInitlTicketsFilterState';
import { THotelList } from 'services/hotel/prepare/interface';
import { useCreateQueryAndPush } from './useCreateQueryAndPush';

export const useHandleFilter = (ticketsData: THotelList) => {
  const { query } = useRouter();
  const { initTicketsFilterState } = useInitTicketsFilterState(ticketsData);
  const desktopFilterChanged = useRef(false);
  const { createQueryAndPush } = useCreateQueryAndPush();

  const [bottomSheetIsVisible, setBottomSheetIsVisible] = useState<boolean>(false);
  const [ticketsFilterState, setTicketsFilterState] = useState(
    createTicketsFilterState(query as QueryType, initTicketsFilterState),
  );
  const handleTicketsFilterIconClick = () => {
    setBottomSheetIsVisible(true);
  };

  const handleTicketsFilterChange = (e: TicketsFilterChangeEventType) => {
    setTicketsFilterState(e.state);
  };

  const handleDesktopTicketsFilterChange = (e: TicketsFilterChangeEventType) => {
    desktopFilterChanged.current = true;
    setTicketsFilterState(e.state);
    createQueryAndPush(query as QueryType, e.state);
  };

  const handleTicketsFilterChipsChange = (e: TicketsFilterChangeEventType) => {
    setTicketsFilterState(e.state);
    createQueryAndPush(query as QueryType, e.state);
  };

  const handleTicketsFilterSubmit = () => {
    bottomSheetSubmitted.current = true;
    setBottomSheetIsVisible(false);
    createQueryAndPush(query as QueryType, ticketsFilterState);
  };

  const handleRemoveTicketsFilterClick = () => {
    setTicketsFilterState(initTicketsFilterState);
    createQueryAndPush(query as QueryType, initTicketsFilterState);
  };

  const handleDesktopRemoveTicketsFilterClick = () => {
    setTicketsFilterState(initTicketsFilterState);
    createQueryAndPush(query as QueryType, initTicketsFilterState);
  };

  const [filtersDrawerIsOpen, setFiltersDrawerIsOpen] = useState(false);
  const handleFiltersDrawerIconClick = () => {
    setFiltersDrawerIsOpen(true);
  };
  const handleFiltersDrawerCloseClick = () => {
    setFiltersDrawerIsOpen(false);
  };
  const handleFiltersDrawerSubmitClick = () => {
    createQueryAndPush(query as QueryType, ticketsFilterState);
    setFiltersDrawerIsOpen(false);
  };

  const ticketsFilterStateBeforeBottomSheetOpen = useRef(ticketsFilterState);
  const bottomSheetSubmitted = useRef(false);

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
    desktopFilterChanged,
    setTicketsFilterState,
    filtersDrawerIsOpen,
    handleFiltersDrawerSubmitClick,
    handleFiltersDrawerCloseClick,
    handleFiltersDrawerIconClick,
    ticketsFilterStateBeforeBottomSheetOpen,
    bottomSheetSubmitted,
  };
};
