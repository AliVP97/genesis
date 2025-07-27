import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { BusSeatsResponse } from 'services/bus/seats/interface';
import { BusInfo } from 'services/bus/tickets/interface';
import { RootState } from 'store';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';
import { Device } from 'utils/interface';
import routes from 'utils/routes/web';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { busDataObject } from 'store/slices/ecommerce/ecomerceSlice';
import { useAddSeats, useOrder, useSeats } from '../hooks';
import { useGetBusSeatsMatrix } from '../tickets/hooks/useGetBusSeatsMatrix';
import { useHandleSelectSeat } from './hooks/useHandleSelectSeat';

export const useSeatSelection = (device: Device) => {
  const [selectedTicket, setSelectedTicket] = useState<BusInfo>();
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const { data: busSeatsData, isLoading: isLoadingBusSeats } = useSeats(selectedTicket?.busId);

  const { login, checkAuth, visible } = useAuthContext();
  const [isloginStarted, setIsLoginStarted] = useState(false);

  const { seatsMatrix } = useGetBusSeatsMatrix(busSeatsData as BusSeatsResponse);

  const {
    toggleSeatSelection,
    selectedSeats,
    setSelectedSeats,
    isAddPassengerVisible,
    setIsAddPassengerVisible,
  } = useHandleSelectSeat();

  const { push, query, prefetch } = useRouter();

  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const dispatch = useDispatch();
  const { busData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);

  const { data: orderData } = useOrder(query.id as string);

  useEffect(() => {
    if (orderData?.seats?.length && orderData.seats.length > 0) {
      setSelectedSeats(orderData.seats);
    }
  }, [orderData]);

  const { mutateAsync: addSeats, isLoading: isSubmiting } = useAddSeats(
    query.id as string | undefined,
    selectedTicket?.busId,
    {
      onMutate: () => {
        setIsSearchButtonClicked(true);
      },
      onSuccess: () => {
        if (busData) {
          const busObject: busViewListItemModel = {
            ...(busData as busViewListItemModel),
            passengerLength: selectedSeats.length,
          };
          dispatch(busDataObject({ data: busObject }));
          const busEvent = new BusTrackingEvent();
          busEvent.addToCart(busObject as busViewListItemModel);
        }
        push(`${routes.BUS}${query.id}/passengers`);
      },
      onError: (error) => {
        setIsSearchButtonClicked(false);
        toast.error(error.response?.data?.message || error.message);
      },
    },
  );

  const handleSeatConfirm = async () => {
    if (selectedSeats.length) {
      if (!login) {
        checkAuth({ closable: false, visible: true });
        setIsLoginStarted(true);
        return;
      }
      await addSeats({
        seats: selectedSeats,
      });
    }
  };

  useEffect(() => {
    const localData = JSON.parse(sessionStorage.getItem('bus_ticket') as string) as BusInfo;

    if (localData) {
      setSelectedTicket(localData);
    }

    prefetch(`${routes.BUS}${query.id}/passengers`);
  }, []);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      setIsAddPassengerVisible(false);
    }
  }, [selectedSeats]);

  useEffect(() => {
    if (isAddPassengerVisible && device === 'mobile') {
      const wrapper = document.querySelector('#mobile-layout');
      setTimeout(() => {
        wrapper?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300);
    }
  }, [isAddPassengerVisible]);
  useEffect(() => {
    if (isloginStarted && login) {
      setIsLoginStarted(false);
      handleSeatConfirm();
    }
  }, [login]);
  useEffect(() => {
    if (!visible) {
      setIsLoginStarted(false);
    }
  }, [visible]);
  return {
    isLoadingBusSeats,
    seatsMatrix,
    toggleSeatSelection,
    selectedSeats,
    showPriceDetails,
    setShowPriceDetails,
    selectedTicket,
    handleSeatConfirm,
    isSearchButtonClicked,
    isSubmiting,
    busSeatsData,
  };
};
