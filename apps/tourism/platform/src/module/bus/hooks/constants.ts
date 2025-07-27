import { orderQuery } from './useOrder';
import { seatsQuery } from './useSeats';
import { passengersQuery } from './usePassengers';
import { passengersQuery as passengersQueryV3 } from './usePassengersV3';

export const QUERIES = {
  getOrder: orderQuery,
  getSeats: seatsQuery,
  getPassengers: passengersQuery,
  getPassengersV3: passengersQueryV3,
};
