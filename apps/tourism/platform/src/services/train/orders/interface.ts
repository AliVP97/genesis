import { definitions } from 'types/rajatrain';
import { PassengerPayload } from '../tickets/priceDetail/interface';

export type CompartmentGenderType = definitions['rajaCompartmentGenderType'];

export type RequestedTrain = {
  trainId: string;
  wantCompartment: boolean;
};
export interface CreateOrderPayload {
  requestedTrain: RequestedTrain[] | undefined;
  passenger: PassengerPayload;
  compartmentGenderType: CompartmentGenderType | undefined;
}

export interface CreateOrderData {
  orderId: 'string';
}

export type TrainOrder = definitions['rajaGetOrderResponse'];
export type TrainTrips = definitions['rajaTrainTrip'];
export interface AddOrderPassengerPayload {
  passengerIds?: string[];
}

export type SetPassengersOptionalService = definitions['TrainSetPassengersOptionalServiceBody'];
