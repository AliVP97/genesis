import { useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import router, { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import UAParser from 'ua-parser-js';
import { useSelector } from 'react-redux';

import { useOrder } from 'module/bus/hooks';
import { RootState } from 'store';
import { handleSuccessWalletOrder } from 'components/payment/utils/handleWalletOrder';
import { reserveTicket } from 'services/bus/reserve';
import { createPaymentOrder, getGateways, sendWalletOrder } from 'services/general/payment';
import { OrderPayload } from 'services/general/payment/interface';
import { updateOrderBusContactInfo } from 'services/bus/contact';
import { notify } from 'utils/notification';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';
import { validateMobile } from 'utils/helpers/validations';

const formatPhoneNumber = (phoneNumber?: string) => {
  if (typeof phoneNumber === 'string') {
    if (validateMobile(phoneNumber, { startWith: ['98'] })) {
      const mobileStartWithZero = '0' + phoneNumber.slice(2, 12);

      return mobileStartWithZero;
    }

    return phoneNumber;
  }

  return '';
};

export type TContactState = {
  phoneNumber: string;
  email: string;
  hasChanged: boolean;
};
import { definitions } from 'types/bus';
import { WALLET_IDs } from 'module/general/constants/walletIDs';

export const useHandlePayment = (gatewayId?: number) => {
  const [loading, setLoading] = useState(false);
  const [paymentBottomSheet, setPaymentBottomSheet] = useState(false);
  const contactState = useState<TContactState>({
    phoneNumber: '',
    email: '',
    hasChanged: false,
  });
  const isValidContactInfoState = useState(false);
  const [contactInfo, setContactInfo] = contactState;

  const wallet = useRef(false);
  const { isMobile } = useDeviceDetect();
  const { query, asPath } = useRouter();
  const orderId = query.id as string;

  const { data: orderData, refetch } = useOrder(orderId);

  const { busData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);

  const handlePaymentButton = async () => {
    sessionStorage.setItem('RECENT_PAGE', asPath);

    if (contactInfo.hasChanged) {
      await updateOrderBusContactInfo({
        phoneNumber: contactInfo.phoneNumber,
        email: contactInfo.email,
        orderId: orderId,
      });

      setContactInfo((prev) => ({ ...prev, hasChanged: false }));
    }

    const { paymentJwt, serviceId } = await reserveTicket(orderId);

    const id = localStorage.getItem('user_id') as string;
    const userAgent = new UAParser();
    const reqHeader = {
      version: userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
      id,
    };

    const { data: gateWayData } = await getGateways({
      serviceId: serviceId as string,
    });
    const payload = {
      orderId: paymentJwt,
      callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}tourism/receipt/v2`,
      gatewayId:
        gatewayId ||
        gateWayData?.filter(
          (el) => el.paymentMethod === (sessionStorage.platform === 'superapp' ? 'mpg' : 'ipg'),
        )?.[0]?.id,
    };

    if (gatewayId && WALLET_IDs.includes(gatewayId)) {
      // 9 gift wallet 11 & 12 ilam
      setLoading(true);
      wallet.current = true;
      const data = await sendWalletOrder({
        payload: payload as OrderPayload['payload'],
        reqHeader: reqHeader as OrderPayload['reqHeader'],
      });

      paymentJwt &&
        data?.OrderId &&
        handleSuccessWalletOrder(
          data,
          data?.OrderId as string,
          paymentJwt,
          'bus',
          contactInfo.phoneNumber,
        );
      setLoading(false);
      return;
    } else if (sessionStorage.getItem('platform') === 'superapp' && gatewayId !== 5) {
      return { paymentJwt };
    }

    const { refId, paymentGateway, paymentMethod } = await createPaymentOrder({
      payload: payload as OrderPayload['payload'],
      reqHeader: reqHeader as OrderPayload['reqHeader'],
    });

    if (busData) {
      const busEvent = new BusTrackingEvent();
      busEvent.addPaymentInfo(busData as busViewListItemModel, paymentMethod);
    }

    return { refId, paymentGateway };
  };

  const { mutate: submitMutate, isLoading } = useMutation({
    mutationFn: handlePaymentButton,
    onSuccess: (data) => {
      if (wallet.current) {
        return;
      }
      if (sessionStorage.platform === 'superapp' && gatewayId !== 5) {
        sessionStorage.setItem('incoming-payment', data?.paymentJwt as string);
        /* window.location.replace(
          (process.env.NEXT_PUBLIC_SUPERAPP_HOME +
            `incoming-payment?ref=${window.location.pathname.replace(
              '/tourism/',
              '',
            )}`) as string,
        ); */
        window.location.replace('/incoming-payment');
      } else {
        void router.push(
          `${data?.paymentGateway + `?RefId=${data?.refId}&MobileNo=${contactInfo.phoneNumber}`}`,
        );
      }
    },
    onError: (err: AxiosError<definitions['rpcStatus']>) => {
      notify({ type: 'error', message: err.response?.data?.message });
      setLoading(false);
    },
  });

  const onSubmit = () => {
    setLoading(true);
    isMobile ? setPaymentBottomSheet(true) : submitMutate();
  };

  const onDismiss = () => {
    loading && setLoading(false);
    setPaymentBottomSheet(false);
  };

  useEffect(() => {
    setContactInfo((prev) => ({
      ...prev,
      phoneNumber: formatPhoneNumber(orderData?.internalContactPhone),
      email: orderData?.internalEmail || '',
    }));
  }, [orderData]);

  return {
    isLoading: loading || isLoading,
    onSubmit,
    onDismiss,
    paymentBottomSheet,
    isMobile,
    contactState,
    isValidContactInfoState,
    orderData,
    refetch,
  };
};
