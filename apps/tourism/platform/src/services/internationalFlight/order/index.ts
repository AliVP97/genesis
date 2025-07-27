import request from '../../axios';
import API from 'utils/routes/api';
import {
  TBookResponse,
  TContactInfoRequest,
  TGetInvoiceResponse,
  TCreateOrderPayload,
  TCreateOrderResponse,
  TInternationalFlightOrder,
  TTicketPdfResponse,
  TApplyPackage,
} from './interface';
import { QueryFunctionContext } from 'react-query';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';

export const createOrder = async (payload: TCreateOrderPayload) => {
  const { data }: { data: TCreateOrderResponse } = await request.post(
    API.INTERNATIONALFLIGHT.CREATE_ORDER,
    {
      requestId: payload.requestId,
      itineraryId: payload.itineraryId,
    },
  );
  return data;
};

export const getOrder = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TInternationalFlightOrder } = await request.get(
    API.INTERNATIONALFLIGHT.CREATE_ORDER + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const getOrderV2 = async (ctx: QueryFunctionContext) => {
  const { data }: { data: GetOrderResponseV2 } = await request.get(
    API.INTERNATIONALFLIGHT.CREATE_ORDER_V2 + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const applyPackage = async (payload: TApplyPackage) => {
  const { data }: { data: TCreateOrderResponse } = await request.post(
    `${API.INTERNATIONALFLIGHT.ORDER_APPLY_REFUND_PACKAGE}/${payload.orderId}`,
    {
      serviceId: payload.serviceId,
      orderId: payload.orderId,
    },
  );
  return data;
};

export const removePackage = async (payload: TApplyPackage) => {
  const { data }: { data: TCreateOrderResponse } = await request.delete(
    `${API.INTERNATIONALFLIGHT.ORDER_REMOVE_REFUND_PACKAGE}/${payload.orderId}`,
    {
      data: {
        serviceId: payload.serviceId,
        orderId: payload.orderId,
      },
    },
  );
  return data;
};

export const reserve = async (orderId: string, signal: AbortSignal | undefined) => {
  const { data }: { data: TBookResponse } = await request.post(
    `${API.INTERNATIONALFLIGHT.CREATE_ORDER}/${orderId}/book`,
    { signal },
  );
  return data;
};

export const getPaymentInfo = async (orderId: string) => {
  const { data }: { data: TGetInvoiceResponse } = await request.get(
    `${API.INTERNATIONALFLIGHT.CREATE_ORDER}/${orderId}/invoice`,
  );
  return data;
};

export const setContactInfo = async (payload: TContactInfoRequest) => {
  const { data }: { data: Record<string, never> } = await request.post(
    `${API.INTERNATIONALFLIGHT.CREATE_ORDER}/${payload.orderId}/set-contact-infos`,
    {
      orderId: payload.orderId,
      contactInfos: [
        {
          phoneNumber: payload.contactInfos?.[0].phoneNumber,
          email: payload.contactInfos?.[0].email,
        },
      ],
    },
  );
  return data;
};

export const downloadApi = async (orderId: string) => {
  const { data }: { data: TTicketPdfResponse } = await request.get(
    `${API.INTERNATIONALFLIGHT.CREATE_ORDER}/${orderId}/pdf`,
  );
  return data;
};

export const refund = async (payload: { orderId: string }) => {
  const { data }: { data: Record<string, never> } = await request.post(
    `${API.INTERNATIONALFLIGHT.REFUND}`,
    payload,
  );
  return data;
};
