import { components } from 'types/international-flight';

export type TInternationalPrepareRequest = {
  cabinCriteria?: {
    cabinType?: CabinType | number;
  };
  origin?: {
    code?: string;
    type?: IATAType | number;
  };
  destination?: {
    code?: string;
    type?: IATAType | number;
  };
  passengerCriteria?: components['schemas']['InternationalFlightPb.PassengerCriteria'];
  tripMode?: TInternationalTripMode;
  departureDate?: string;
  returnDate?: string;
};

export type TInternationalPrepareResponse =
  components['schemas']['InternationalFlightPb.PrepareAvailabilityResponse'];

export type TInternationalAvailabilityListResponse =
  components['schemas']['InternationalFlightPb.AvailabilityListResponse'];

export type TInternationalTicket = components['schemas']['InternationalFlightPb.Itinerary'];
export type TInternationalTrip = components['schemas']['InternationalFlightPb.Flight'];

export type TInternationalTripMode = components['schemas']['InternationalFlightPb.TripMode'];

export type TDictionary = {
  iataDictionary?: {
    [key: string]: components['schemas']['InternationalFlightPb.IATAEntry'];
  };
  aircraftDictionary?: {
    [key: string]: components['schemas']['InternationalFlightPb.AircraftEntry'];
  };
  airlineDictionary?: {
    [key: string]: components['schemas']['InternationalFlightPb.AirlineEntry'];
  };
};

export enum CabinType {
  'CABIN_TYPE_UNDEFINED',
  'CABIN_TYPE_ECONOMY',
  'CABIN_TYPE_PREMIUM',
  'CABIN_TYPE_BUSINESS',
  'CABIN_TYPE_FIRST',
}

export enum IATAType {
  'IATA_TYPE_AIRPORT',
  'IATA_TYPE_CITY',
}

export type IntDaysPrices = components['schemas']['InternationalFlightPb.CalendarPriceData'][];

export type CalendarPriceData = components['schemas']['InternationalFlightPb.CalendarPriceData'];
