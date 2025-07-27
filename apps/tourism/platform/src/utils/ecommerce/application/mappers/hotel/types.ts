import { ParsedUrlQuery } from 'querystring';
import { TGetHotelsResponse } from 'services/hotel/prepare/interface';
import { definitions } from 'types/hotel';

export type hotelViewListItemModel = {
  data: THotelResponseList;
  query: ParsedUrlQuery;
  quantity?: number;
  itemPosition?: number;
};

export type THotelResponseList = TGetHotelsResponse['list'];
export type THotelList = definitions['hotelHotelList'];

export interface IMapQueryToObject {
  facilities: string;
  stars: string;
  sort: string;
}

export const CONSTANT = {
  INTENATIONAL_HOTEL: 'International Hotel',
  DOMESTIC_HOTEL: 'Domestic Hotel',
};
