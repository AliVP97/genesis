// import {
//   TTourContent,
//   TTourPaymentInfo,
//   TTourTableContent,
// } from 'containers/landingPage/types';
// import {TSearchTour} from 'module/tour/search';
// import {IAddToCart} from '../application/mappers/tour/types';
import { IVisa, TVisaAddToCartEvent } from '../application/mappers/visa/types';
// import {OrderDetailResponse} from 'services/general/payment/interface';
import { propsModel } from '../application/mappers/domestic-flight/types';
import {
  viewItemListModel,
  viewItemListModelV2,
} from '../application/mappers/international-flight/types';
import { ParsedUrlQuery } from 'querystring';
import { busViewListItemModel, purchaseBusModel } from '../application/mappers/bus/types';
import { trainViewListItemModel } from '../application/mappers/train/types';
import { IPurchasePropsModel } from './models';
import { hotelViewListItemModel } from '../application/mappers/hotel/types';

// export interface ITourTrackingRepository {
//   viewItemList(items: TSearchTour): void;
//   selectItem(items: TTourContent): void;
//   addToCart(items: IAddToCart): void;
//   removeFromCart(items: TTourTableContent, tourId: string): void;
//   beginCheckout(items: TTourTableContent, tourId: string): void;
//   addPaymentInfo(items: TTourPaymentInfo): void;
//   purchase(items: OrderDetailResponse): void;
// }

export interface IVisaTrackingRepository {
  viewItemList(items: Array<IVisa>): void;
  selectItem(item: IVisa): void;
  addToCart(item: TVisaAddToCartEvent): void;
  viewItem(item: IVisa): void;
  addPaymentInfo(item: TVisaAddToCartEvent): void;
  beginCheckout(item: TVisaAddToCartEvent): void;
  removeFromCart(item: TVisaAddToCartEvent): void;
  purchase(item: TVisaAddToCartEvent): void;
}

export interface IBusTrackingRepository {
  viewItemList(items: busViewListItemModel): void;
  selectItem(item: busViewListItemModel): void;
  addToCart(item: busViewListItemModel): void;
  viewCart(item: busViewListItemModel): void;
  addPaymentInfo(item: busViewListItemModel, paymentMethod: string | undefined): void;
  beginCheckout(item: busViewListItemModel): void;
  purchase(item: busViewListItemModel, props: purchaseBusModel): void;
}
export interface IDomesticFlightTrackingRepository {
  viewItemList(items: propsModel): void;
  selectItem(item: propsModel, index: number): void;
  addToCart(item: propsModel): void;
  viewCart(item: propsModel): void;
  addPaymentInfo(item: propsModel, paymentGateway: string | undefined): void;
  beginCheckout(item: propsModel): void;
  removeFromCart(item: propsModel): void;
  purchase(item: propsModel, props: IPurchasePropsModel): void;
}

export interface IFlightInternationalTrackingRepository {
  viewItemList(items: viewItemListModel): void;
  selectItem(item: viewItemListModelV2, index: number): void;
  addToCart(item: viewItemListModel): void;
  beginCheckout(item: viewItemListModel): void;
  viewCart(items: viewItemListModel): void;
  addPaymentInfo(item: viewItemListModel, paymentMethod: string | undefined): void;
  removeFromCart(item: viewItemListModel): void;
  purchase(item: viewItemListModel, props: IPurchasePropsModel): void;
  search(item: ParsedUrlQuery): void;
}

export interface ITrainTrackingRepository {
  viewItemList(items: trainViewListItemModel, mode: string): void;
  selectItem(item: trainViewListItemModel): void;
  addToCart(item: trainViewListItemModel): void;
  beginCheckout(item: trainViewListItemModel, passengerLength: number): void;
  viewCart(items: trainViewListItemModel, passengerLength: number): void;
  addPaymentInfo(
    item: trainViewListItemModel,
    paymentMethod: string | undefined,
    passengerLength: number,
  ): void;
  purchase(item: trainViewListItemModel, props: IPurchasePropsModel, passengerLength: number): void;
}

export interface IHotelTrackingRepository {
  viewItemList(items: hotelViewListItemModel): void;
  selectItem(item: hotelViewListItemModel): void;
  addToCart(item: hotelViewListItemModel, totalPrice: number): void;
  beginCheckout(item: hotelViewListItemModel): void;
  viewCart(items: hotelViewListItemModel): void;
  addPaymentInfo(item: hotelViewListItemModel, paymentMethod: string | undefined): void;
  removeFromCart(item: hotelViewListItemModel, totalPrice: number): void;
  purchase(item: hotelViewListItemModel, props: IPurchasePropsModel): void;
}
