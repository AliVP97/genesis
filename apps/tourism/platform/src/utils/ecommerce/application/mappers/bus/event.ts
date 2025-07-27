import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { Currency } from 'utils/ecommerce/domain/constants';
import { IBusTrackingRepository } from 'utils/ecommerce/domain/repositories';
import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { busViewListItemModel, purchaseBusModel } from './types';
import { captureException } from 'utils/ecommerce/errorHandeling';
import { generateDataLayerObject } from './helper';

export class BusTrackingEvent implements IBusTrackingRepository {
  viewItemList(items: busViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
        value: generateDataLayerObject({ tickets: items, quantityProps: 1 }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  selectItem(item: busViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.SELECT_ITEM,
        value: generateDataLayerObject({ tickets: item, quantityProps: 1 }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addToCart(item: busViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.ADD_TO_CART,
        value: generateDataLayerObject({ tickets: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  viewCart(item: busViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_CART,
        value: generateDataLayerObject({ tickets: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addPaymentInfo(item: busViewListItemModel, paymentMethod: string | undefined): void {
    try {
      const optional = {
        payment_type: paymentMethod,
      };

      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
          value: generateDataLayerObject({ tickets: item }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
  beginCheckout(item: busViewListItemModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
        value: generateDataLayerObject({ tickets: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  purchase(item: busViewListItemModel, props: purchaseBusModel): void {
    try {
      const optional = {
        currency: Currency.TRY,
        value: props?.price ? parseInt(props?.price) : 0,
        transaction_id: props.rrn,
      };

      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.PURCHASE,
          value: generateDataLayerObject({ tickets: item }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
}
