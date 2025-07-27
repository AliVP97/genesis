import { components } from 'types/international-flight';

export type GetOrderForRefundResponse =
  components['schemas']['InternationalFlightPb.GetOrderForRefundResponse'];

export type Passenger = components['schemas']['InternationalFlightPb.Passenger'];

export type RefundItinerary = components['schemas']['InternationalFlightPb.refund_itinerary'];

export type RefundReason = components['schemas']['InternationalFlightPb.refund_reason'];

export type ConfirmRefundRequest = Required<
  components['schemas']['InternationalFlightPb.ConfirmRefundRequest']
>;

export type ConfirmRefundResponse =
  components['schemas']['InternationalFlightPb.ConfirmRefundResponse'];
