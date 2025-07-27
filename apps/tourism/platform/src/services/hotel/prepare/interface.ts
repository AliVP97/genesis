import { definitions } from 'types/hotel';

export type TGetHotelSearchIdRequest = definitions['hotelPrepareRequest'];
export type TPersonAgeType = definitions['apihotelPerson'];

export type TGetHotelSearchIdResponse = definitions['hotelPrepareResponse'];

export type TGetHotelsResponse = definitions['apihotelHotelSearchResponse'];
export type THotelList = TGetHotelsResponse['list'];
export type THotelInfo = definitions['hotelHotelList'];
export type THotelDetails = definitions['hotelHotelDetails'];
export type THotelDetailsFacilities = definitions['apihotelFacility'][];
export type THotelAbout = definitions['apihotelAbout'];
