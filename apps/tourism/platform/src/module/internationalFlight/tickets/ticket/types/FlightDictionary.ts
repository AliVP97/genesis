import Iata from './Iata';
import Airline from './Airline';
import { components } from 'types/international-flight';

export interface FlightDictionary {
  iata?: Record<string, Iata>;
  airline?: Record<string, Airline>;
  airCraft?: Record<string, components['schemas']['InternationalFlightPb.AircraftEntry']>;
}
