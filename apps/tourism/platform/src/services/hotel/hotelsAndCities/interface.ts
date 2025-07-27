import { components } from 'types/international-flight';
import { definitions } from 'types/hotel';

export type THotelsAndCitiesResponse = definitions['hotelCityHotelsResponse'];
export type THotelInfo = definitions['apihotelDetailResponse'];

export type TInternationalFlightSearchAirportsResponse =
  components['schemas']['InternationalFlightPb.SearchAirportsResponse'];

export type TInternationalFlightCabinType =
  components['schemas']['InternationalFlightPb.CabinType'];

export type HotelInfoParams = {
  requestId: string;
  hotelId: string;
};
