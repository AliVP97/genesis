import { SearchHistory } from 'module/flights/tickets/ticket/searchTicket/interface';
import { ParsedUrlQuery } from 'querystring';
import { GetDomesticTicketResponse } from 'services/domestic/flight/interface';
import { definitions } from 'types/domestic-flight-aggregator';
import { IDefaultDataLayerTracking } from 'utils/ecommerce/domain/models';

export type domesticFlightInfoAggregator = definitions['domesticflightaggregatorFlightInfo'][];

export type propsModel = {
  ticketsData: domesticFlightInfoAggregator;
  query: ParsedUrlQuery;
  locations: SearchHistory | null;
  itinerary?: GetDomesticTicketResponse[];
  index?: number;
  passengerLength?: number;
};

export type DomesticFlightSelectItem = {
  selectedTicket: IDefaultDataLayerTracking[];
};

export interface IDomesticFlightDataLayer {
  Item_id: string;
  item_name: string;
  item_brand: string;
  item_category: string;
  Item_category2: string;
  price: number;
  index: string;
  Item_list_name: string;
  Item_list_id: string;
  item_category3: string;
  item_category4: string;
  quantity: number;
}

export interface IDomesticFlightMapQueryToObject {
  flightClass: string;
  toward: string;
  backward: string;
  sort: string;
  ticketType: string;
  domesticFlightMode: string;
  quantity: number;
}

export interface IDomesticFlightGenerateDataLayerProps {
  flights: domesticFlightInfoAggregator;
  query: ParsedUrlQuery;
  locations: SearchHistory;
  index?: number;
  passengerLength?: number;
}
