import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { isEqual } from 'lodash';

import {
  TicketsFilterChangeEventType,
  TicketsFilterStateMemberType,
} from 'containers/ticketsFilter/types';
import { QueryType } from 'utils/helpers/global';
import { createTicketsFilterState } from 'containers/ticketsFilter/utils';
import { TrainResponse } from 'services/train/tickets/interface';
import { useCreateQueryAndPush } from '../../hooks/useCreateQueryAndPush';
import { getInitialFilterState } from '../../hooks/utils';

export const useFilter = (trainLists: TrainResponse['trainLists']) => {
  const router = useRouter();

  const initialFilterState = useMemo(() => getInitialFilterState(trainLists), [trainLists]);

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false);

  const [tempFilterState, setTempFilterState] = useState<TicketsFilterStateMemberType[]>(
    createTicketsFilterState(router.query as QueryType, initialFilterState),
  );
  const [filterState, setFilterState] = useState(
    createTicketsFilterState(router.query as QueryType, initialFilterState),
  );

  useEffect(() => {
    setFilterState(createTicketsFilterState(router.query as QueryType, initialFilterState));
  }, [initialFilterState]);

  const { createQueryAndPush } = useCreateQueryAndPush();

  const handleFilterIconClick = () => {
    setIsBottomSheetVisible(true);
  };

  const handleFilterChange = (newFilterState: TicketsFilterChangeEventType) => {
    setTempFilterState(newFilterState.state);
  };

  const handleDesktopFilterChange = (newFilterState: TicketsFilterChangeEventType) => {
    setFilterState(newFilterState.state);
    createQueryAndPush(router.query as QueryType, newFilterState.state);
  };

  const handleFilterChipsChange = (newFilterState: TicketsFilterChangeEventType) => {
    setFilterState(newFilterState.state);
    createQueryAndPush(router.query as QueryType, newFilterState.state);
  };

  const handleFilterSubmit = () => {
    setIsBottomSheetVisible(false);
    if (tempFilterState) {
      setFilterState(tempFilterState);
    }
    createQueryAndPush(router.query as QueryType, filterState);
  };

  const handleRemoveFilterClick = () => {
    setFilterState(initialFilterState);
    createQueryAndPush(router.query as QueryType, initialFilterState);
  };

  const isInitialFilter = isEqual(filterState, initialFilterState);

  useEffect(() => {
    if (isBottomSheetVisible && !isEqual(filterState, tempFilterState)) {
      setTempFilterState(filterState);
    }
  }, [isBottomSheetVisible]);

  return {
    tempFilterState,
    filterState,
    isInitialFilter,
    isBottomSheetVisible,
    setIsBottomSheetVisible,
    handleFilterIconClick,
    handleFilterChange,
    handleDesktopFilterChange,
    handleFilterChipsChange,
    handleFilterSubmit,
    handleRemoveFilterClick,
  };
};
