import { TicketsFilterChangeEventType } from 'containers/ticketsFilter/types';
import { useRouter } from 'next/router';
import { RefObject, useMemo, useRef, useState } from 'react';
import { QueryType } from 'utils/helpers/global';
import { createTicketsFilterState } from 'containers/ticketsFilter/utils';
import { useInitTicketsFilterState } from './useIntelTicketsFilterState';
import { useCreateQueryAndPush } from 'module/internationalFlight/tickets/hooks/useCreateQueryAndPush';
import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { cloneDeep } from 'lodash';
import getQueryWithoutFilterKeys from '../helpers/getQueryWithoutFilterKeys';
import { AvailabilityListResponseV2 } from '../types/api';

export const useHandleFilter = (
  ticketsData: AvailabilityListResponseV2,
  elementToScrollTo?: RefObject<HTMLDivElement>,
) => {
  const { query } = useRouter();
  const { initTicketsFilterState } = useInitTicketsFilterState(ticketsData);
  // const desktopFilterChanged = useRef(false);

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
    // desktopFilterChanged.current = true;
    setTicketsFilterState(e.state);
    createQueryAndPush(query as QueryType, e.state);
    elementToScrollTo?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toFilterState = (sections: TicketsFilterStateType) =>
    cloneDeep(sections).map((section) => {
      section.title =
        {
          priceRange: 'قیمت (ریال)',
          departureDuration: 'مدت سفر رفت',
          returningDuration: 'مدت سفر برگشت',
          ticketType: 'نوع بلیط',
          departureTime: 'ساعت حرکت رفت',
          returningTime: 'ساعت حرکت برگشت',
          departureStops: 'تعداد توقف رفت',
          returningStops: 'تعداد توقف برگشت',
          airlines: 'شرکت‌های هواپیمایی',
        }[section.id] || '';
      return section;
    });

  const handleTicketsFilterChipsChange = (e: TicketsFilterChangeEventType) => {
    setTicketsFilterState(toFilterState(e.state));
    createQueryAndPush(query as QueryType, toFilterState(e.state));
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
    const newQuery = getQueryWithoutFilterKeys(query as QueryType);
    createQueryAndPush(newQuery as QueryType, []);
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

  const filtersLength = useMemo(() => {
    let counter = 0;

    const filterNames = [
      'priceRange',
      'departureDuration',
      'returningDuration',
      'ticketType',
      'departureTime',
      'returningTime',
      'departureStops',
      'returningStops',
      'airlines',
    ];

    for (const key in query) {
      const filterId = filterNames.find((filterName) => filterName === key);
      if (filterId) {
        if (['priceRange', 'departureDuration', 'returningDuration'].includes(filterId)) {
          const initMin = initTicketsFilterState.find((filter) => filter.id === filterId)?.component
            .staticValues?.minMax[0];
          const initMax = initTicketsFilterState.find((filter) => filter.id === filterId)?.component
            .staticValues?.minMax[1];

          let queryMin, queryMax;
          if (typeof query[key] === 'string') {
            queryMin = (query[key] as string)?.split(',')?.[0];
            queryMax = (query[key] as string)?.split(',')?.[1];
          }

          (queryMin != initMin || queryMax != initMax) && counter++;
        } else counter++;
      }
    }

    return counter;
  }, [query, initTicketsFilterState]);

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
    // desktopFilterChanged,
    setTicketsFilterState,
    filtersDrawerIsOpen,
    handleFiltersDrawerSubmitClick,
    handleFiltersDrawerCloseClick,
    handleFiltersDrawerIconClick,
    ticketsFilterStateBeforeBottomSheetOpen,
    bottomSheetSubmitted,
    filtersLength,
  };
};
