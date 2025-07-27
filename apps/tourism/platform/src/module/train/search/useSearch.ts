import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';

import { ParsedUrlQuery } from 'querystring';
import { TrainResponse } from 'services/train/tickets/interface';
import { trainDataObject } from 'store/slices/ecommerce/ecomerceSlice';
import { checkExpiry } from 'store/slices/expireTime';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { useAppDispatch } from 'store/hook/storeHook';
import URLS from 'utils/routes/web';
import { notFoundRedirectUrlChanged } from 'store/slices/app/app';
import { SearchHistory } from '../tickets/interface';
import {
  useAvailableDatesContents,
  useGetTickets,
  usePrepareRequestHandler,
  useSelectTicket,
} from './hooks';
import { trainSearchUrlSchema, TTrainUrlQuery } from './utils';
import { queryToLocation } from '../utils';

export const useSearch = (isLoginCall: boolean) => {
  const { query, push, asPath, replace } = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();

  const {
    isIdleGetTicketList,
    prepareRequestHandler,
    ticketsData,
    getTicketsLoading,
    getTrainListError,
  } = usePrepareRequestHandler(isLoginCall);

  const { tickets, selectedTickets, setSelectedTickets } = useGetTickets(
    ticketsData as TrainResponse,
  );

  const {
    handleSelectTicket,
    handleChangeTowardTicket,
    setSelectedTicketReturning,
    setSelectedTicketDeparture,
  } = useSelectTicket(selectedTickets, setSelectedTickets);

  const [locations, setLocations] = useState<null | Pick<SearchHistory, 'origin' | 'destination'>>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [prevQuery, setPrevQuery] = useState<ParsedUrlQuery | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sort, ...newQuery } = trainSearchUrlSchema.parse(query);

    if (!prevQuery || !isEqual(newQuery, prevQuery)) {
      setPrevQuery(newQuery);
      prepareRequestHandler();
    }
    localStorage.setItem('train_search_query', JSON.stringify(newQuery));
  }, [query, prevQuery, prepareRequestHandler]);

  useEffect(() => {
    if (ticketsData) {
      setIsLoading(false);
    }
  }, [ticketsData]);

  useEffect(() => {
    if (ticketsData) {
      const trainEvent = new TrainTrackingEvent();
      const trainData: trainViewListItemModel = {
        data: tickets,
        query: query,
      };
      trainEvent.viewItemList(trainData);
      dispatch(trainDataObject({ data: trainData }));
    }
  }, [tickets, ticketsData, dispatch, query]);

  const fetchLocations = async () => {
    try {
      const { origin, destination } = await queryToLocation(query as TTrainUrlQuery);

      setLocations({
        origin: {
          code: origin?.code || '',
          farsiName: origin?.farsiName || '',
        },
        destination: {
          code: destination?.code || '',
          farsiName: destination?.farsiName || '',
        },
      });
    } catch (error) {
      appDispatch(notFoundRedirectUrlChanged(URLS.TRAIN));
      replace('/404');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [queryClient]);

  useEffect(() => {
    const savedSelectedTickets = JSON.parse(
      sessionStorage.getItem('train_selected_ticket') as string,
    );
    if (savedSelectedTickets) {
      setSelectedTicketDeparture(savedSelectedTickets[0]);
      setSelectedTicketReturning(savedSelectedTickets[1]);
    }

    if (!query.returningDate && selectedTickets.length > 0) {
      setSelectedTickets([]);
    }
  }, [asPath, query.returningDate, selectedTickets, setSelectedTickets]);

  useEffect(() => {
    if (ticketsData?.trainLists?.[0]) {
      localStorage.setItem('uuid-expiry', JSON.stringify(Number(ticketsData.validUntil)));
      const timeout = setTimeout(
        () => checkExpiry({ type: 'uuid', expired: true }),
        Number(ticketsData.validUntil),
      );
      return () => clearTimeout(timeout);
    }
  }, [ticketsData]);

  const isReturnTrip = !!selectedTickets.length;

  const isFullCapacity = ticketsData?.trainLists?.map(({ isCapacityFull }) => isCapacityFull)?.[
    Number(isReturnTrip)
  ];

  const availableDatesContents = useAvailableDatesContents(ticketsData, isReturnTrip);

  const handleEmptyResultClick = () => push('/train');

  return {
    isIdleGetTicketList,
    locations,
    selectedTickets,
    handleChangeTowardTicket,
    getTicketsLoading,
    availableDatesContents,
    getTrainListError,
    tickets,
    isFullCapacity,
    handleSelectTicket,
    loading: isLoading,
    prepareRequestHandler,
    ticketsData,
    departureDate: query.departureDate,
    returningDate: query.returningDate,
    handleEmptyResultClick,
    isReturnTrip,
  };
};
