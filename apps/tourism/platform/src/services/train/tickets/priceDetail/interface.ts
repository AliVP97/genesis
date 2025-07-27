import { definitions } from 'types/rajatrain';

export interface PassengerPayload {
  adult: number;
  child: number;
  infant: number;
}
export type PassengersCount = {
  adult: string;
  child: string;
  infant: string;
  wantCompartment: string;
};
export interface PriceDetailPayload {
  trainId: string;
  passenger: PassengerPayload;
  wantCompartment: boolean;
}
export interface PriceDetailData {
  totalPrice: string;
  priceDetail: PriceDetail[];
}

export interface PriceDetail {
  count?: string;
  tariff?: Tariff;
  price?: string;
  totalPrice?: string;
}

export type Tariff = definitions['rajaTariff'];
