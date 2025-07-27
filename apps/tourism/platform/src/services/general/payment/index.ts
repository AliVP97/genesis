import { QueryFunctionContext } from 'react-query';
import { AxiosRequestConfig } from 'axios';
import { UAParser } from 'ua-parser-js';
import request from 'services/axios';
import API from 'utils/routes/api';
import {
  OrderPayload,
  OrderResponse,
  PaymentBanner,
  PaymentRequestHeader,
  WalletOrderRes,
} from './interface';
import { GateWaysResponse } from 'services/domestic/flight/interface';
import { definitions } from 'types/payment';

const userAgent = new UAParser();

const paymentRequestOptions = (
  options?: AxiosRequestConfig<unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): AxiosRequestConfig<any> => ({
  headers: {
    'Accept-Language': 'fa-IR',
    'Grpc-metadata-Device-Info': localStorage.getItem('user_id') || '',
    'Grpc-metadata-Device-ID': userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
  },
  ...options,
});

export const getOrderDetail = async ({ meta }: QueryFunctionContext) => {
  const { orderId } = meta as Record<'orderId' | keyof PaymentRequestHeader, string>;

  const { data } = await request.get<definitions['paymentOrderStatusResponse']>(
    API.GET_ORDER_STATUS + `/${orderId}`,
    paymentRequestOptions(),
  );
  return data;
};

export const getOrderReceipt = async ({ meta }: QueryFunctionContext) => {
  const { orderId } = meta as Record<'orderId' | keyof PaymentRequestHeader, string>;

  const { data } = await request.get<definitions['paymentOrderReceiptResponse']>(
    API.GET_ORDER_RECEIPT + `/${orderId}`,
    paymentRequestOptions(),
  );
  return data;
};

export const getOrderInvoice = async (orderJWT: string) => {
  const { data } = await request.post(
    API.GET_ORDER_INVOICE,
    { orderId: orderJWT },
    paymentRequestOptions(),
  );
  return data as definitions['paymentInvoiceResponse'];
};

export const createPaymentOrder = async (body: OrderPayload) => {
  const { data }: { data: OrderResponse } = await request.post(
    API.CREATE_PAYMENT_ORDER,
    body.payload,
    paymentRequestOptions(),
  );
  return data;
};

export const getGateways = async ({
  serviceId,
  totalSum,
}: {
  serviceId: string | number;
  totalSum?: number;
}) => {
  const { data }: { data: GateWaysResponse } = await request.get(
    `${API.GATEWAYS}?serviceId=${serviceId}&price=${totalSum ? totalSum : 0}`,
    paymentRequestOptions(),
  );
  return data;
};

export const sendWalletOrder = async (body: OrderPayload) => {
  const { data }: { data: WalletOrderRes } = await request.post(
    API.CREATE_WALLET_ORDER,
    body.payload,
    paymentRequestOptions(),
  );
  return data;
};

export const paymentBanner = async () => {
  const { data }: { data: { data: PaymentBanner } } = await request.get(API.PAYMENT.GET_BANNER, {
    params: {
      page: 'payment_receipt',
    },
    headers: {
      'Grpc-metadata-Device-ID': userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
      'Grpc-metadata-Platform': 'PWA',
    },
  });
  return data.data;
};
