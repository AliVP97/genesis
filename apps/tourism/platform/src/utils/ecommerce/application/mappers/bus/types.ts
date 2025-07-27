import { ParsedUrlQuery } from 'querystring';
import { BusTickets } from 'services/bus/tickets/interface';

export const BusType = {
  VIP: 'VIP',
};

export type busViewListItemModel = {
  query: ParsedUrlQuery;
  data: BusTickets;
  quantity?: number;
  itemPosition?: number;
  passengerLength?: number;
};

export type purchaseBusModel = {
  rrn?: string;
  price?: string;
};

export interface IBusMapQueryToObject {
  departureTimeRanges: string;
  busTypes: string;
  sort: string;
  quantity: number;
}

export interface IBusGenerateDataLayerProps {
  tickets: busViewListItemModel;
  quantityProps?: number;
}
