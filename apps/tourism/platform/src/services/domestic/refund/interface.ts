import { definitions } from 'types/shoppingorder';

export type TRefundReasonResponse = definitions['apishoppingorderGetRefundReasonsResponse'];

export type TicketsRefundInfo = definitions['apishoppingorderRefundResponse'];

export type TRefundReasons =
  | 'REFUNDREASON_UNDEFINED'
  | 'REFUNDREASON_FLIGHT_CANCELED'
  | 'REFUNDREASON_BY_CRCN'
  | 'REFUNDREASON_FLIGHT_DELAYED';

export interface RefundEndpointPayload {
  orderId: string;
  ticketIds: Array<string>;
  refundReason: TRefundReasons;
}
