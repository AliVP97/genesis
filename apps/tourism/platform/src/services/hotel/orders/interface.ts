import { definitions } from 'types/hotel';

export type TGetHotelOrder = definitions['hotelOrder'];
export type THotelOrderRoom = definitions['apihotelRoom'];
export type THotelOrderPassengers = definitions['apihotelPassengers'][];
export type THotelReserveResponse = definitions['apihotelReserveResponse'];
export type THotelContactInfo = definitions['hotelContactInfo'];
export type TCheckTime = definitions['hotelCheck'];
export type TCreateOrderPayload = definitions['hotelAddRoomRequest'] & {
  nights?: number | undefined;
};
export type TCreateOrderResponse = definitions['hotelOrderID'];
export type cancellationRules = definitions['apihotelCancellationRules'][];
