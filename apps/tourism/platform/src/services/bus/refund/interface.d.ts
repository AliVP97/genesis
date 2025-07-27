import { definitions } from './../../../types/bus';
interface IBusCalculateRefundPayload {
  orderId: string;
  refundReason: string;
}

type TBusCalcRefund = definitions['busCalcRefundResponse'];

type TBusRefundReasons = definitions['busRefundReasonsResponse'];

type TBusRefundReasonType = definitions['busRefundReason'];
interface IBusRefundPayload {
  orderId: string;
  refundReason: TBusRefundReasonType;
}
