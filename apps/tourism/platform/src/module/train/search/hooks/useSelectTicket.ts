import { Dispatch, SetStateAction, useState } from 'react';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { TicketType, TrainTicket } from 'module/train/tickets/interface';
import { RootState } from 'store';
import { trainDataObject } from 'store/slices/ecommerce/ecomerceSlice';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { resetFilters } from 'utils/helpers/resetFilters';
import { useAuthContext } from 'utils/hooks/useAuthContext';

export const useSelectTicket = (
  selectedTickets: TrainTicket[] | [],
  setSelectedTickets: Dispatch<SetStateAction<TrainTicket[] | []>>,
) => {
  const { query, push } = useRouter();
  const { lazyLogin } = useAuthContext();
  const dispatch = useDispatch();

  const { trainData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);

  const initialState = {
    selectedTicketDeparture: null,
    selectedTicketReturning: null,
    setSelectedTicketDeparture: () => ({}),
    setSelectedTicketReturning: () => ({}),
    handleChangeTowardTicket: () => ({}),
  };
  const selectTrainTicket = (data: TrainTicket[], index?: number) => {
    const command = {
      requestedTrain: data?.map((item) => {
        return {
          trainId: item.trainId,
          wantCompartment: item.isCoupe,
        };
      }),
      passenger: {
        adult: Number(query?.adult),
        child: Number(query?.child),
        infant: Number(query?.infant),
      },
      compartmentGenderType: query?.gender,
    };

    if (trainData) {
      const selectedTicket: trainViewListItemModel = {
        ...(trainData as trainViewListItemModel),
        selectedTrain: Array.isArray(data) ? data : [data],
        itemPosition: index,
      };
      dispatch(trainDataObject({ data: selectedTicket }));
    }

    sessionStorage.setItem('train_selected_ticket', JSON.stringify(data));
    sessionStorage.setItem('train_command', JSON.stringify(command));
    void push({
      pathname: `/train/passengers`,
      query: data[0]?.isInternational ? { isInternational: true } : undefined,
    });
  };

  const callAddToCartEvent = (data: TrainTicket, index?: number) => {
    if (trainData) {
      const trainEvent = new TrainTrackingEvent();
      const selectedTicket: trainViewListItemModel = {
        ...(trainData as trainViewListItemModel),
        selectedTrain: Array.isArray(data) ? data : [data],
        itemPosition: index ?? 0,
      };
      trainEvent.addToCart(selectedTicket);
    }
  };
  const handleSelectTicket = async (data: TrainTicket, index?: number) => {
    try {
      await lazyLogin();

      if (!query?.returningDate) {
        callAddToCartEvent(data, index);
        selectTrainTicket([data], index);
      }

      // TO Way and Select Departure Ticket
      if (query.returningDate && !selectedTickets?.length) {
        callAddToCartEvent(data, index);
        setSelectedTickets((prev) => [...prev, data]);
        resetFilters(query, push);
        return;
      }

      // To Way and select returning Ticket
      if (query?.returningDate && selectedTickets?.length) {
        callAddToCartEvent(data, index);
        selectTrainTicket([...selectedTickets, data], index);
      }
    } catch (error) {}
  };

  const [, setSelectedState] = useState(initialState);

  const setSelectedTicketDeparture = (selectedTicketDeparture: TicketType) => {
    setSelectedState({
      ...initialState,
      ...selectedTicketDeparture,
    });
  };
  const setSelectedTicketReturning = (selectedTicketReturning: TicketType | null) => {
    const selectedTicket = JSON.parse(sessionStorage.getItem('train_selected_ticket') as string);
    setSelectedState({
      ...initialState,
      selectedTicketDeparture: selectedTicket?.[0],
      ...selectedTicketReturning,
    });
  };

  const handleChangeTowardTicket = () => {
    resetFilters(query, push);
    setSelectedTickets([]);
  };
  return {
    handleSelectTicket,
    handleChangeTowardTicket,
    setSelectedTicketReturning,
    setSelectedTicketDeparture,
  };
};
