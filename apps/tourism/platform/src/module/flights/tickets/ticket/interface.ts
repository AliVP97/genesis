import { definitions } from 'types/domestic-flight-aggregator';

export type TicketType = definitions['aggregatorSuggestedFlights'];
export type TicketList = TicketType[];

export enum TabType {
  DETAIL = 'DETAIL',
  POLICY = 'POLICY',
}
