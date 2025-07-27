import { components } from 'types/international-flight';

export type TSetPassengersPayload = {
  orderId?: string;
  passengers?: TInternationalPassengerPayload[] | string[];
};
export type TSetPassengersPayloadV3 = {
  orderId?: string;
  passengerIds?: string[];
};

export type TInternationalPassengerPayload = {
  passengerId?: string;
  passengerType?: components['schemas']['InternationalFlightPb.PassengerType'] | number;
  gender?: components['schemas']['InternationalFlightPb.Passenger_Types_Gender'] | number;
  firstName?: components['schemas']['InternationalFlightPb.Name'];
  lastName?: components['schemas']['InternationalFlightPb.Name'];
  birthDate?: string;
  contactInfo?: components['schemas']['InternationalFlightPb.ContactInfo'];
  nationality?: string;
  nationalCode?: string;
  passport?: components['schemas']['InternationalFlightPb.Passport'];
};

export type TSetPassengersResponse = {
  data: string;
};
