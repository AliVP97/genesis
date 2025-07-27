import { definitions } from 'types/domestic-flight-aggregator';

export type TicketType = definitions['domesticflightaggregatorFlightInfo'];
export type TicketList = TicketType[];

export enum TabType {
  DETAIL = 'DETAIL',
  POLICY = 'POLICY',
}
