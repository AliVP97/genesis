import { definitions } from 'types/hotel';

export type THotelRooms = definitions['apihotelRoomResponse'];
export type TRoom = definitions['hotelRooms'];
export type TRoomDetails = definitions['apihotelRoom'];

export type THotelSimilars = definitions['apihotelHotelSearchResponse'];
export interface IHotelRoomsPayload {
  hotelId: string;
  requestId: string;
}
export interface IHotelsSimilarPayload {
  hotelId: string;
  requestId: string;
}
