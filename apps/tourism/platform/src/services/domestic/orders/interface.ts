import { definitions } from 'types/shoppingorder';
import { definitions as tripTypes } from 'types/trips';
import { definitions as rajaTypes } from 'types/rajatrain';

export type Order = definitions['apishoppingorderGetOrderResponse'];
export type GetOrderResponse = definitions['apishoppingorderGetOrdersResponse'];
export type OrderPassengerList = definitions['apishoppingorderOrderPassenger'][];
export type OrderPassenger = definitions['apishoppingorderPassenger'];
export type OrderTicket = definitions['apishoppingorderTicket'];
export type OrderTickets = OrderTicket[];
export type TripType = tripTypes['tripsTripType'];
export type CustomOrderPassenger = (definitions['apishoppingorderOrderPassenger'] & {
  return: boolean;
})[];

export type TrainOrder = rajaTypes['rajaGetOrderResponse'];
export type TrainTrip = rajaTypes['rajaTrainTrip'];
export type TrainInfo = rajaTypes['rajaTrainInfo'];

export type GetTripReponse = tripTypes['tripsGetTripListResponse'];
export type TTrips = tripTypes['tripsTripsInfo'][];
export type TTrip = tripTypes['tripsTripsInfo'];
export type TTripTypes = tripTypes['apitripsType'];

export type TripsTrips = {
  data: Order | TrainOrder;
  type: TripType;
};

export type TFlightCreateOrderPayload = definitions['apishoppingorderCreateOrder2Request'];

export type TFlightCreateOrderResponse = definitions['apishoppingorderCreateOrderResponse'];

// export type GetTripReponse = {
//   trips: Array<TripsTrips>;
// };
