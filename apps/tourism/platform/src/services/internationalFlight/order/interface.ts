import { components } from 'types/international-flight';

export type TCreateOrderResponse =
  components['schemas']['InternationalFlightPb.CreateOrderResponse'];
export type TGetOrderResponse = components['schemas']['InternationalFlightPb.GetOrderResponse'];
export type TGetOrderPassenger = components['schemas']['InternationalFlightPb.Passenger'][];

export type TCreateOrderPayload = {
  requestId: string;
  itineraryId: string;
};

export type TApplyPackage = {
  serviceId: string;
  orderId: string;
};

export type TBookResponse = components['schemas']['InternationalFlightPb.BookResponse'];

export type TGetInvoiceResponse = components['schemas']['InternationalFlightPb.GetInvoiceResponse'];

export type TContactInfoRequest =
  components['schemas']['InternationalFlightPb.SetContactInfosRequest'];
export type TInternationalFlightOrder =
  components['schemas']['InternationalFlightPb.GetOrderResponse'];

export type TInternationalFlightPassengerType =
  components['schemas']['InternationalFlightPb.PassengerType'];

export type TInternationalFlightGenderType =
  components['schemas']['InternationalFlightPb.Passenger_Types_Gender'];

export type TInternationalFlightAgeType =
  components['schemas']['InternationalFlightPb.Passenger_Types_Gender'];
export type TTicketPdfResponse =
  components['schemas']['InternationalFlightPb.GetTicketsPdfResponse'];
