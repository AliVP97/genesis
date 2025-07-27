import { definitions } from 'types/bus';

export type BusPrepareRequest = definitions['busPrepareBusListRequest'];
export type BusPrepareResponse = definitions['busPrepareBustListResponse'];
export type TBusOrder = definitions['busOrder'];
export type TBusOrderPassengers = definitions['busPassengers'];
export type TBusGenderTypes = definitions['apibusGender'];
export type TBusRefund = definitions['apibusRefund'];

export interface CreateOrderPayload {
  busId: string;
  isInternational: boolean;
}
export interface CreateOrderData {
  orderId: string;
}

export interface IUpdateContactInfoPayload {
  orderId: string;
  phoneNumber: string;
  email: string;
}

export type TOrderDiscountResponse = definitions['busApplyDiscountResponse'];
export type TRemoveOrderDiscountResponse = definitions['busRemoveDiscountResponse'];
