import { TicketType, TrainTicket } from 'module/train/tickets/interface';
import { ParsedUrlQuery } from 'querystring';
import { definitions } from 'types/rajatrain';

export interface ITourDataLayer {
  item_id: string;
  item_name: string;
  item_brand: string;
  item_category: string;
  item_list_name: string;
  item_list_id: string;
  item_category2: string;
  item_category3: string;
  item_category4: string;
  price: number;
  index: string;
  quantity: number;
}

export type wagontTypeDefination = definitions['rajaWagonType'];
export type rajaTrainList = definitions['rajaTrainInfo'][];
export type rajaTrain = definitions['rajaTrainInfo'];

export interface IPurcIhasePropsModel {
  saleReferenceId: string | unknown;
  price: string | unknown;
}

export type trainViewListItemModel = {
  query: ParsedUrlQuery;
  data: rajaTrainList | undefined;
  selectedTrain?: TrainTicket | TrainTicket[];
  viewDetail?: TicketType[] | [];
  itemPosition?: number;
};

export const SelectedTicketConstant = {
  DEPARTURE: 'DepartureSelected',
  RETURNING: 'ReturningSelected',
};

export interface ITrainMapQueryToObject {
  wantCompartment: string;
  wagonTypes: string;
  departureTimeRanges: string;
  sort: string;
  quantity: number;
}

export interface ITrainGenerateDataLayerProps {
  tickets: rajaTrainList | [];
  query: ParsedUrlQuery;
  itemPosition?: number;
  passengerLength?: number;
}
