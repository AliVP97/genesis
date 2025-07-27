import { useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { handlePaymentByGateway } from './utils';
import { getOrderInvoice } from 'services/general/payment';
import { TInvoiceResponse, TLazyState, TUsePaymentOptions } from './PaymentBottomSheet.types';

const onError = (err: unknown) => {
  if (err instanceof AxiosError) {
    toast.error((err.response?.data as { message: string })?.message);
  }
};

const lazyState: TLazyState = {
  selectedGatewayId: undefined,
  orderJWT: undefined,
};

const selectGateway = (gatewayId: number) => {
  lazyState.selectedGatewayId = gatewayId;
};

export const usePayment = (orderId: string, options?: TUsePaymentOptions) => {
  const [data, setData] = useState<TInvoiceResponse>();
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const isLoading = useMemo(
    () => isInvoiceLoading || isPaymentLoading,
    [isInvoiceLoading, isPaymentLoading],
  );

  const fetchInvoice = async (orderJWT: string) => {
    if (!orderJWT) {
      return Promise.reject('orderJWT in not defined');
    }

    const invoiceData = await getOrderInvoice(orderJWT);

    options?.onSuccess?.(invoiceData);
    setIsInvoiceLoading(false);

    return Promise.resolve(invoiceData);
  };

  const createInvoice = async () => {
    setIsInvoiceLoading(true);

    try {
      const paymentJwt = sessionStorage.getItem('paymentJwt');
      const JWT = options?.onCreate ? await options?.onCreate(orderId) : paymentJwt;

      if (JWT) {
        lazyState.orderJWT = JWT;
        const invoiceData = await fetchInvoice(JWT);

        setData(invoiceData);

        return await Promise.resolve();
      } else {
        setIsInvoiceLoading(false);
        return await Promise.reject("there is no JWT returning in 'onCreate' function");
      }
    } catch (error) {
      options?.onError?.(error);
      onError(error);
      setIsInvoiceLoading(false);

      return Promise.reject(error);
    }
  };

  const cancelInvoice = () => {
    options?.onInvalidate?.();
  };

  const confirmPayment = async () => {
    setIsPaymentLoading(true);

    try {
      const selectedGateway = data?.gateways?.find(({ id }) => id === lazyState.selectedGatewayId);

      if (lazyState.selectedGatewayId) {
        if (options?.onConfirm) {
          const result = options.onConfirm(selectedGateway);

          if (result instanceof Promise) {
            await result;
          }
        }
      }

      const orderJWT = lazyState.orderJWT;

      if (orderJWT && selectedGateway) {
        await handlePaymentByGateway({ orderId, orderJWT, selectedGateway });
      }

      return await Promise.resolve();
    } catch (error) {
      options?.onError?.(error);
      onError(error);

      setIsPaymentLoading(false);

      return Promise.reject(error);
    }
  };

  return {
    invoice: {
      data: { title: data?.title, sections: data?.sections },
      isLoading: isInvoiceLoading,
      create: createInvoice,
      cancel: cancelInvoice,
    },
    gateway: {
      data: data?.gateways,
      isLoading: isPaymentLoading,
      getSelectedId: lazyState.selectedGatewayId,
      select: selectGateway,
      confirm: confirmPayment,
    },
    isLoading,
    meta: data?.meta,
  };
};
