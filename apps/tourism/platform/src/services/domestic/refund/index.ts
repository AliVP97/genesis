import request from 'services/axios';
import API from 'utils/routes/api';
import { TicketsRefundInfo, RefundEndpointPayload, TRefundReasonResponse } from './interface';

export const calcRefund = async (payload: RefundEndpointPayload) => {
  const { data }: { data: TicketsRefundInfo } = await request.post(
    `${API.ORDERS}/${payload.orderId}/calculate-refund`,
    { ticketIds: [...payload.ticketIds], refundReason: payload.refundReason },
  );
  return data;
};

export const refund = async (payload: RefundEndpointPayload) => {
  const { data }: { data: TicketsRefundInfo } = await request.post(
    `${API.ORDERS}/${payload.orderId}/refund`,
    { ticketIds: [...payload.ticketIds], refundReason: payload.refundReason },
  );
  return data;
};

export const getRefundReason = async (orderId: string, flightId: string) => {
  const { data }: { data: TRefundReasonResponse } = await request.get(
    `${API.ORDERS}/${orderId}/flight/${flightId}/refundreasons`,
  );
  return data;
};
