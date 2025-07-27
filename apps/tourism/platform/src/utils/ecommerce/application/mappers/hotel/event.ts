import { IHotelTrackingRepository } from 'utils/ecommerce/domain/repositories';
import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { generateDataLayerObject } from './helper';
import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { captureException } from 'utils/ecommerce/errorHandeling';
import { Currency } from 'utils/ecommerce/domain/constants';
import { IPurchasePropsModel } from 'utils/ecommerce/domain/models';
import { hotelViewListItemModel } from './types';

export class HotelTrackingEvent implements IHotelTrackingRepository {
  viewItemList(items: hotelViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
        value: generateDataLayerObject(items),
      });
    } catch (error) {
      captureException(error);
    }
  }
  selectItem(item: hotelViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.SELECT_ITEM,
        value: generateDataLayerObject(item),
      });
    } catch (error) {
      captureException(error);
    }
  }

  viewCart(item: hotelViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_CART,
        value: generateDataLayerObject(item),
      });
    } catch (error) {
      captureException(error);
    }
  }
  removeFromCart(item: hotelViewListItemModel, totalPrice: number): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.REMOVE_FROM_CART,
        value: generateDataLayerObject(item, totalPrice),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addToCart(item: hotelViewListItemModel, totalPrice: number): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.ADD_TO_CART,
        value: generateDataLayerObject(item, totalPrice),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addPaymentInfo(item: hotelViewListItemModel, paymentMethod: string | undefined): void {
    try {
      const optional = {
        payment_type: paymentMethod,
      };

      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
          value: generateDataLayerObject(item),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
  beginCheckout(item: hotelViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
        value: generateDataLayerObject(item),
      });
    } catch (error) {
      captureException(error);
    }
  }
  purchase(item: hotelViewListItemModel, props: IPurchasePropsModel): void {
    try {
      const optional = {
        currency: Currency.TRY,
        value: props?.price ? parseInt(props?.price as string) : 0,
        transaction_id: props.rrn,
      };

      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.PURCHASE,
          value: generateDataLayerObject(item),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
}
