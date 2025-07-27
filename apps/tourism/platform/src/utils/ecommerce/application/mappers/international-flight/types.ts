import { SearchHistory } from 'module/internationalFlight/search/interface';
import Itinerary from 'module/internationalFlight/tickets/ticket/types/Itinerary';
import { AvailabilityListResponseV2 } from 'module/internationalFlight/tickets/types/api';
import { ParsedUrlQuery } from 'querystring';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import { TInternationalAvailabilityListResponse } from 'services/internationalFlight/flight/interface';

export type IDataLayerObjectCreator = {
  Item_id?: string;
  item_name?: string;
  Item_list_name?: string;
  Item_list_id?: string;
  item_brand?: string;
  item_category?: string;
  Item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  price?: number;
  index?: number;
  quantity?: string;
};

export type viewItemListModel = {
  ticketsData: TInternationalAvailabilityListResponse | AvailabilityListResponseV2;
  query: ParsedUrlQuery;
  locations: SearchHistory | null;
  itinerary?: TIntelTicket;
  itemPosition?: number;
};

export type viewItemListModelV2 = {
  ticketsData: TInternationalAvailabilityListResponse;
  query: ParsedUrlQuery;
  locations: SearchHistory | null;
  itinerary?: Itinerary;
  itemPosition?: number;
};

export interface IInternationalFlightMapQueryToObject {
  sort: string;
  passengers: number;
  tripTime: string;
  tripStop: string;
  ticketType: string;
  mode: string;
  quantity: number;
}

export interface IInternationalFlightGenerateDataLayerProps {
  items: viewItemListModel | viewItemListModelV2;
}
