import { contactInfo } from 'services/general/contact';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { notify } from 'utils/notification';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getOrder, getPaymentInfo, reserveV2 } from 'services/domestic/flight';
import jwt_decode from 'jwt-decode';
import { emailRegex, validationMobile2 } from 'utils/helpers/validations';
import { throwApiErrorMessage } from 'services/axios';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { AxiosError } from 'axios';
import { TGateway } from 'components/DynamicGateways';
import { TUsePaymentOptions } from 'components/PaymentBottomSheet/PaymentBottomSheet.types';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import * as Sentry from '@sentry/nextjs';

export const useHandlePayment = (selectedGateway?: TGateway) => {
  const { isMobile } = useDeviceDetect();
  const { query, push } = useRouter();
  const queryClient = useQueryClient();
  const { data: orderData } = useQuery(['order', query.id as string], getOrder);
  const [contactChange, setContactChange] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationPromise, setConfirmationPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const [reservePriceChange, setReservePriceChange] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const domesticFlightTracking = new DomesticFlightTrackingEvent();
  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const { selectedTicketDeparture, selectedTicketReturning } = useSelectedTicket();
  useEffect(() => {
    const token = localStorage.getItem('UATP');
    const decode: { mobile?: string } = token ? jwt_decode(token) : { mobile: '' };
    if (decode.mobile) {
      setPhoneNumber(decode.mobile);
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const { refetch: fetchPaymentInfo } = useQuery(
    ['paymentInfo', orderData?.orderId],
    () => getPaymentInfo(orderData!.orderId!),
    {
      onError: () => setLoading(false),
      onSettled: () => {
        if (isMobile) setLoading(false);
      },
      enabled: false,
    },
  );

  const showError = (error: AxiosError) => {
    setLoading(false);
    notify({
      type: 'error',
      message:
        (error.response?.data as { message: string })?.message ||
        error?.message ||
        'مشکلی پیش آمده است',
    });
    throwApiErrorMessage(error);
  };

  const handlePriceChangeConfirmation = async () => {
    return new Promise<boolean>((resolve) => {
      setReservePriceChange(true);
      setConfirmationPromise({ resolve });
    });
  };

  const onCreateInvoice: TUsePaymentOptions['onCreate'] = async () => {
    setLoading(true);
    try {
      if (contactChange) {
        if (!(!email.trim() || emailRegex(email)) || !validationMobile2(phoneNumber)) {
          setLoading(false);
          return;
        }
        await contactInfo({
          phoneNumber: phoneNumber,
          email: email,
          orderId: orderData!.orderId!,
        });
      }
      setReservePriceChange(false);

      const { priceChange, price } = await reserveV2(orderData!.orderId!, false);
      if (priceChange) {
        setReservePriceChange(true);
        setNewPrice(price!.totalPrice!);
        const userConfirmed = await handlePriceChangeConfirmation();

        if (!userConfirmed) {
          setLoading(false);
          return;
        }

        await reserveV2(orderData!.orderId!, true);
        await queryClient.invalidateQueries('order');
      }
    } catch (error) {
      setLoading(false);
      showError(error as AxiosError);
    }
    const { data: paymentData } = await fetchPaymentInfo();
    return paymentData?.paymentId;
  };
  const onConfirmPayment: TUsePaymentOptions['onConfirm'] = async () => {
    if (domesticFlightData !== undefined) {
      const viewCartData = [selectedTicketDeparture];
      if (selectedTicketReturning !== undefined) viewCartData.push(selectedTicketReturning);
      const flightData = {
        ...domesticFlightData,
        itinerary: viewCartData,
      };

      domesticFlightTracking.addPaymentInfo(
        flightData as propsModel,
        selectedGateway?.paymentMethod ?? '',
      );
    }
  };
  const handleReserve = async () => {
    if (orderData) {
      const orderJWT = await onCreateInvoice();
      if (orderJWT === undefined || orderJWT === '') return;
      try {
        sessionStorage.setItem('paymentJwt', orderJWT || '');
        push({
          pathname: '/payment/[id]',
          query: { id: orderData.orderId },
        }).catch((error) => Sentry.captureException(error));
      } catch (error) {
        setLoading(false);
        showError(error as AxiosError);
      }
    }
  };
  const { mutate: submitMutate } = useMutation({
    mutationFn: handleReserve,
  });

  const resolveConfirmation = (isConfirmed: boolean) => {
    confirmationPromise?.resolve(isConfirmed);
    setConfirmationPromise(null);
    setReservePriceChange(false);
  };

  return {
    setContactChange,
    setEmail,
    setPhoneNumber,
    submitMutate,
    loading,
    reservePriceChange,
    setReservePriceChange,
    newPrice,
    onCreateInvoice,
    onConfirmPayment,
    resolveConfirmation,
  };
};
