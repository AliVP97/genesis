import { definitions } from 'types/bus';

export type BusTicketResponse = definitions['apibusBusListResponse'];
export type BusInfo = definitions['busBusInfo'];
export type BusTickets = BusInfo[];
export type ErrorResponse = {
  response: {
    data: definitions['rpcStatus'];
  };
};
