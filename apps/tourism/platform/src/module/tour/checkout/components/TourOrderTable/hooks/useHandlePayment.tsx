import router from 'next/router';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { tourPostOrder } from 'services/tour/register';
import { notify } from 'utils/notification';
import { OrderPayload } from 'services/general/payment/interface';
import { createPaymentOrder, getGateways, sendWalletOrder } from 'services/general/payment';
import { handleSuccessWalletOrder } from 'components/payment/utils/handleWalletOrder';

export const useHandlePayment = ({ phone, gatewayId }: { phone: string; gatewayId?: number }) => {
  const [orderToken, setOrderToken] = useState();
  const [walletLoading, setWalletLoading] = useState(false);
  const id = typeof window !== 'undefined' ? (localStorage.getItem('user_id') as string) : '';

  const {
    data: tourPostOrderData,
    isLoading: orderTourPostOrder,
    mutate: tourPostOrderMutate,
  } = useMutation({
    mutationFn: tourPostOrder,
    onSuccess: (res) => {
      setOrderToken(res?.orderId);
      tourGatewayMutate({
        serviceId: '177',
      });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: <span>{error.response.data.message}</span>,
        config: {
          position: 'top-right',
          hideProgressBar: true,
          draggable: true,
        },
      });
    },
  });

  const {
    data: tourGatewayData,
    isLoading: tourGatewayLoading,
    mutate: tourGatewayMutate,
    status: tourGatewayStatus,
  } = useMutation({
    retry: false,
    mutationFn: getGateways,
    onSuccess: async (res) => {
      const ipg = res?.data.find((item: { paymentMethod: string }) => {
        return item.paymentMethod === 'ipg';
      });
      const payload: {
        callback?: string;
        orderId?: string;
        gatewayId: number;
      } = {
        callback: `${process.env.NEXT_PUBLIC_CALLBACK_TOUR_URL}/receipt/v2`,
        orderId: orderToken,
        gatewayId: gatewayId ? gatewayId : ipg?.id ? ipg?.id : 0,
      };
      if (gatewayId === 1 || gatewayId === 9) {
        // 9 is for gift wallet
        setWalletLoading(true);
        const data = await sendWalletOrder({
          payload: payload as OrderPayload['payload'],
          reqHeader: { id, version: '' } as OrderPayload['reqHeader'],
        });

        orderToken &&
          data?.OrderId &&
          handleSuccessWalletOrder(data, data?.OrderId as string, orderToken, 'tour', phone);
        setWalletLoading(false);
        return;
      }

      tourPaymentOrderMutate({
        payload: payload as OrderPayload['payload'],
        reqHeader: { id, version: '' },
      });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: <span>{error.response.data.message}</span>,
        config: {
          position: 'top-right',
          hideProgressBar: true,
          draggable: true,
        },
      });
    },
  });
  const {
    data: tourPaymentOrderData,
    isLoading: tourPaymentOrderLoading,
    mutate: tourPaymentOrderMutate,
    status: tourPaymentOrderStatus,
  } = useMutation({
    retry: false,
    mutationFn: createPaymentOrder,
    onSuccess: (res) => {
      res &&
        void router.push(
          `${res?.paymentGateway + `?RefId=${String(res?.refId)}&MobileNo=${String(phone)}`}`,
        );
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: error?.response?.data?.message,
      });
    },
  });
  return {
    tourPostOrderMutate,
    orderTourPostOrder,
    tourPostOrderData,
    tourGatewayData,
    tourGatewayLoading,
    tourGatewayMutate,
    tourGatewayStatus,
    tourPaymentOrderData,
    tourPaymentOrderLoading,
    tourPaymentOrderMutate,
    tourPaymentOrderStatus,
    walletLoading,
  };
};
