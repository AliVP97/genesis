import { QueryFunctionContext } from 'react-query';
import request from 'services/axios';
import API from 'utils/routes/api';
import {
  IBusCalculateRefundPayload,
  IBusRefundPayload,
  TBusCalcRefund,
  TBusRefundReasons,
} from './interface';

export const busCalcRefund = async (payload: IBusCalculateRefundPayload) => {
  const { data }: { data: TBusCalcRefund } = await request.post(
    `${API.BUS.GET_BUS_ORDER}/${payload.orderId}/calculateRefund`,
    { refundReason: payload.refundReason },
  );
  return data;
};

export const busGetRefundReason = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TBusRefundReasons } = await request.get(
    `${API.BUS.GET_BUS_ORDER}/${ctx.queryKey[1]}/refundReasons`,
  );
  return data;
};

export const busRefund = async (payload: IBusRefundPayload) => {
  const { data } = await request.delete(`${API.BUS.GET_BUS_ORDER}/${payload.orderId}`, {
    data: { refundReason: payload.refundReason },
  });
  return data;
};
