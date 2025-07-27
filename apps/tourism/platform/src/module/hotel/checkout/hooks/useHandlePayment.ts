import { useMutation, useQuery } from 'react-query';
import { notify } from 'utils/notification';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { contactInfo, getOrder, reserve } from 'services/hotel/orders';
import jwt_decode from 'jwt-decode';
import { THotelReserveResponse } from '../../../../services/hotel/orders/interface';
import { throwApiErrorMessage } from 'services/axios';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
import { handlePaymentByGateway } from 'components/PaymentBottomSheet/utils';
import { TGateway } from 'components/DynamicGateways';

export const useHandlePayment = (selectedGateway?: TGateway) => {
  const { query, asPath } = useRouter();
  const { data: orderData } = useQuery(['order', query.id as string], getOrder);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [reservePriceChange, setReservePriceChange] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('UATP');
    const decode: { mobile?: string } = token ? jwt_decode(token) : { mobile: '' };

    if (decode.mobile) {
      setPhoneNumber(decode.mobile);
    }
  }, []);

  useEffect(() => {
    if (confirmed) paymentMutate();
  }, [confirmed]);

  const [isLoading, setIsLoading] = useState(false);
  const [reserveInfo, setReserveInfo] = useState<THotelReserveResponse>();

  const handleReserve = async () => {
    setIsLoading(true);
    sessionStorage.setItem('RECENT_PAGE', asPath);

    if (phoneNumber) {
      try {
        await contactInfo({
          phoneNumber: phoneNumber,
          email: email,
          orderId: orderData!.orderId!,
        });
        const data = await reserve(orderData!.orderId!, false);
        setReserveInfo(data);
        const { isReserved, isPricedChanged, payment } = data;

        if (isPricedChanged) {
          setReservePriceChange(true);
          setNewPrice(payment!.totalPrice!.toString());
        } else if (isReserved) {
          setIsReserved(true);
        } else {
          paymentMutate();
        }
      } catch (error) {
        setIsLoading(false);
        throwApiErrorMessage(error);
      }
    }
  };

  const { hotelData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);

  const handlePaymentButton = async () => {
    if (reserveInfo?.isPricedChanged && confirmed) {
      const data = await reserve(orderData!.orderId!, true);
      setReserveInfo(data);
    }
    setReservePriceChange(false);
    if (hotelData) {
      if (hotelData instanceof Object && 'data' in hotelData) {
        const hotelEvent = new HotelTrackingEvent();
        hotelEvent.addPaymentInfo(
          hotelData as hotelViewListItemModel,
          selectedGateway?.paymentMethod,
        );
      }
    }
    if (orderData?.orderId && reserveInfo?.paymentJwt && selectedGateway) {
      await handlePaymentByGateway({
        orderId: orderData.orderId,
        orderJWT: reserveInfo?.paymentJwt,
        selectedGateway,
      });
    }
  };

  const { mutate: paymentMutate } = useMutation({
    mutationFn: handlePaymentButton,
    onError: (err: { response: { data: { message: string } } }) => {
      setIsLoading(false);
      notify({ type: 'error', message: err?.response?.data?.message });
    },
  });

  const { mutate: submitMutate } = useMutation({
    mutationFn: handleReserve,
  });

  return {
    submitMutate,
    setEmail,
    isLoading,
    setPhoneNumber,
    confirmed,
    setConfirmed,
    reservePriceChange,
    setReservePriceChange,
    newPrice,
    isReserved,
    phoneNumber,
  };
};
