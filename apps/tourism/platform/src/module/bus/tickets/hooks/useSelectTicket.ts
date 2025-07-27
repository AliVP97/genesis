import { useEffect } from 'react';

import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { RootState } from 'store';
import { busDataObject } from 'store/slices/ecommerce/ecomerceSlice';
import { createOrder as busCreateOrder } from 'services/bus/order';
import { BusInfo } from 'services/bus/tickets/interface';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';
import { QUERIES } from 'module/bus/hooks';
import { TErrorResponse } from 'services/bus';
import { useAuthContext } from 'utils/hooks/useAuthContext';

export const useSelectTicket = () => {
  const queryClient = useQueryClient();
  const { push, prefetch } = useRouter();
  const { lazyLogin } = useAuthContext();

  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: busCreateOrder,
    onMutate: ({ busId }) => {
      queryClient.prefetchQuery(QUERIES.getSeats(busId));
    },
    onSuccess: ({ orderId }, { isInternational }) => {
      push(`/bus/${orderId}/seatSelection${isInternational ? '?isInternational=true' : ''}`);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { busData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  const handleSelectTicket = async (data: BusInfo, index?: number) => {
    try {
      await lazyLogin();

      sessionStorage.setItem('bus_ticket', JSON.stringify(data));

      const busEvent = new BusTrackingEvent();
      if (busData) {
        const dataLayerObject: busViewListItemModel = {
          ...(busData as busViewListItemModel),
          data: [data],
          itemPosition: index ?? 0,
        };
        dispatch(busDataObject({ data: dataLayerObject }));
        busEvent.selectItem(dataLayerObject as busViewListItemModel);
      }

      if (!data?.busId) {
        return;
      }

      mutate({ busId: data.busId, isInternational: !!data.isInternational });
    } catch (error) {}
  };

  useEffect(() => {
    prefetch('/bus/[id]/seatSelection');
  }, []);

  return {
    handleSelectTicket,
  };
};
