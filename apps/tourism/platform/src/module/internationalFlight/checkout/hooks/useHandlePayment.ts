import jwt_decode from 'jwt-decode';
import UAParser from 'ua-parser-js';
import { createPaymentOrder, getGateways, sendWalletOrder } from 'services/general/payment';
import { OrderPayload } from 'services/general/payment/interface';
import { useMutation, useQuery } from 'react-query';
import { notify } from 'utils/notification';
import router, { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getOrder,
  getPaymentInfo,
  reserve,
  setContactInfo,
} from 'services/internationalFlight/order';
import { handleSuccessWalletOrder } from 'components/payment/utils/handleWalletOrder';
import { throwApiErrorMessage } from 'services/axios';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { TUsePaymentOptions } from 'components/PaymentBottomSheet/PaymentBottomSheet.types';
import { WALLET_IDs } from 'module/general/constants/walletIDs';
import { useAppDispatch } from 'store/hook/storeHook';
import { onClickPaymentButton } from 'store/slices/internationalFlight/invoice';

export const useHandlePayment = (gatewayId?: number) => {
  const { query, asPath } = useRouter();
  const { data: orderData } = useQuery(['order', query.id as string], getOrder);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const signalController = new AbortController();
  const [signal, setSignal] = useState<AbortSignal>(signalController.signal);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      signalController.abort();
      setSignal(signalController?.signal);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('UATP');
    const decode: { mobile?: string } = token ? jwt_decode(token) : { mobile: '' };
    if (decode.mobile) {
      setPhoneNumber(decode.mobile);
    }
  }, []);
  const dispatch = useAppDispatch();
  const { internationalFlightCartObject } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const wallet = useRef(false);

  const postContactInfoIntoOrder = useCallback(
    async (orderId: string) => {
      try {
        await setContactInfo({
          orderId,
          contactInfos: [{ phoneNumber: phoneNumber, email: email }],
        });
      } catch (error) {
        throwApiErrorMessage(error);
      }
    },
    [phoneNumber, email, setContactInfo],
  );

  const handlePaymentButton = async () => {
    sessionStorage.setItem('RECENT_PAGE', asPath);

    if (phoneNumber && email) {
      setIsLoading(true);
      dispatch(onClickPaymentButton(true));
      try {
        await postContactInfoIntoOrder(orderData!.order!.orderId!);
        await reserve(orderData!.order!.orderId!, signal);
        const { invoiceToken, serviceId } = await getPaymentInfo(orderData!.order!.orderId!);

        const id = localStorage.getItem('user_id') as string;
        const userAgent = new UAParser();
        const reqHeader = {
          version: userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
          id,
        };
        const { data: gateWayData } = await getGateways({
          serviceId: String(serviceId),
        });

        const payload = {
          orderId: invoiceToken,
          callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}tourism/receipt/v2`,
          gatewayId:
            gatewayId ||
            gateWayData?.filter(
              (el) => el.paymentMethod === (sessionStorage.platform === 'superapp' ? 'mpg' : 'ipg'),
            )?.[0]?.id,
        };

        if (gatewayId && WALLET_IDs.includes(gatewayId)) {
          // 9 gift wallet 11 & 12 ilam
          setIsLoading(true);
          wallet.current = true;
          const data = await sendWalletOrder({
            payload: payload as OrderPayload['payload'],
            reqHeader: reqHeader as OrderPayload['reqHeader'],
          });

          if (invoiceToken !== undefined) {
            if (data?.OrderId !== undefined) {
              handleSuccessWalletOrder(
                data,
                data?.OrderId as string,
                invoiceToken,
                'international',
                phoneNumber,
              );
            }
          }
          setIsLoading(false);
          return;
        } else if (sessionStorage.getItem('platform') === 'superapp' && gatewayId !== 5) {
          return { invoiceToken };
        }

        const { refId, paymentGateway, orderId, paymentMethod } = await createPaymentOrder({
          payload: payload as OrderPayload['payload'],
          reqHeader: reqHeader as OrderPayload['reqHeader'],
        });
        if (
          internationalFlightCartObject instanceof Object &&
          'ticketsData' in internationalFlightCartObject
        ) {
          const internationalFlightTracking = new FlightInternationalTracking();
          internationalFlightTracking.addPaymentInfo(
            internationalFlightCartObject as viewItemListModel,
            paymentMethod,
          );
        }

        return { refId, paymentGateway, orderId };
      } catch (error) {
        setIsLoading(false);
        throwApiErrorMessage(error);
      }
    }
  };

  const handleCreatePayment: TUsePaymentOptions['onCreate'] = async (orderId) => {
    if (!orderId) {
      return;
    }

    await postContactInfoIntoOrder(orderData!.order!.orderId!);
    const { invoiceToken } = await getPaymentInfo(orderData!.order!.orderId!);

    return invoiceToken;
  };

  const handleConfirmPayment: TUsePaymentOptions['onConfirm'] = (gateway) => {
    if (
      internationalFlightCartObject instanceof Object &&
      'ticketsData' in internationalFlightCartObject
    ) {
      const internationalFlightTracking = new FlightInternationalTracking();
      internationalFlightTracking.addPaymentInfo(
        internationalFlightCartObject as viewItemListModel,
        gateway?.paymentType,
      );
    }

    return reserve(orderData!.order!.orderId!, signal);
  };

  const { mutate: submitMutate } = useMutation({
    mutationFn: handlePaymentButton,
    onError: (err) => {
      dispatch(onClickPaymentButton(false));
      notify({ type: 'error', message: (err as Error).toString() });
    },
    onSuccess: (data) => {
      if (wallet.current) {
        return;
      }
      if (phoneNumber && email) {
        if (sessionStorage.platform === 'superapp' && gatewayId !== 5) {
          sessionStorage.setItem('incoming-payment', data?.invoiceToken as string);

          window.location.replace('/incoming-payment');
        } else {
          void router.push(
            `${data?.paymentGateway + `?RefId=${data?.refId}&MobileNo=${phoneNumber}`}`,
          );
        }
      }
    },
  });

  return {
    setEmail,
    setPhoneNumber,
    submitMutate,
    isLoading,
    handleCreatePayment,
    handleConfirmPayment,
  };
};
