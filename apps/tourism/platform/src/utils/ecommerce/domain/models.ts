import { PaymentMethod } from 'utils/static/paymentType';
import { EventTypes } from './constants';

export interface ITrackEventParams {
  type: EventTypes;
  value?: unknown;
  optional?: unknown;
}
export interface IDefaultDataLayerTracking {
  item_name: string;
  index: number;
  item_brand: string;
  item_category: string;
  item_category2: string;
  item_category3: string;
  item_category4: string;
  item_category5: string;
  item_category6: string;
  item_list_id: string;
  item_list_name: string;
  item_variant: string;
  price: number;
  quantity: number;
}
export interface IAddPaymentInfoDataLayer extends IDefaultDataLayerTracking {
  transaction_id: string;
  value: number;
  currency: string;
  coupon: string;
  payment_type: PaymentMethod;
}

export interface IRefundDataLayer {
  transaction_id: string;
}
export interface IPurchasePropsModel {
  rrn: string | unknown;
  price: string | unknown;
}
