import { ParsedUrlQuery } from 'querystring';
import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { IFlightInternationalTrackingRepository } from 'utils/ecommerce/domain/repositories';
import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { viewItemListModel, viewItemListModelV2 } from './types';

import { Currency, ProductType } from 'utils/ecommerce/domain/constants';
import { generateItemListName } from 'utils/ecommerce/domain/utils';
import { captureException } from 'utils/ecommerce/errorHandeling';
import { generateDataLayerObject, mapQueryToObject } from './helper';
import { IPurchasePropsModel } from 'utils/ecommerce/domain/models';

export class FlightInternationalTracking implements IFlightInternationalTrackingRepository {
  search(query: ParsedUrlQuery): void {
    const { tripTime, tripStop, sort, ticketType, mode } = mapQueryToObject(query);
    const splitedTicketType = ticketType ? (ticketType as string).split('_')[2] : null;
    const itemListText = generateItemListName([
      tripTime as string,
      tripStop as string,
      sort as string,
      splitedTicketType as string,
    ]);
    createTrackingEvent({
      type: BaseTrackingEventActionsType.SEARCH,
      value: {
        event: BaseTrackingEventActionsType.SEARCH,
        item_list_name: itemListText,
        item_category: ProductType.INTERNATIONAL_FLIGHT,
        item_category2: mode,
        // item_category3 : locations?.destination?.data?.['cityTitle'],
        // item_category4 :  locations?.origin?.data?.['cityTitle'],
        tripmode: `${itemListText} + ${mode}`,
      },
    });
  }
  viewItemList(items: viewItemListModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
        value: generateDataLayerObject({ items }),
      });
    } catch (error) {
      captureException(error);
    }
  }

  selectItem(item: viewItemListModelV2, index?: number): void {
    try {
      item.itemPosition = index;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.SELECT_ITEM,
        value: generateDataLayerObject({ items: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addToCart(item: viewItemListModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.ADD_TO_CART,
        value: generateDataLayerObject({ items: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  beginCheckout(item: viewItemListModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
        value: generateDataLayerObject({ items: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  viewCart(item: viewItemListModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_CART,
        value: generateDataLayerObject({ items: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addPaymentInfo(item: viewItemListModel, paymentMethod: string | undefined): void {
    try {
      const optional = {
        payment_type: paymentMethod,
      };
      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
          value: generateDataLayerObject({ items: item }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
  removeFromCart(item: viewItemListModel): void {
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.REMOVE_FROM_CART,
        value: generateDataLayerObject({ items: item }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  purchase(item: viewItemListModel, props: IPurchasePropsModel): void {
    try {
      const optional = {
        currency: Currency.TRY,
        value: props.price ? parseInt(props.price as string) : 0,
        transaction_id: props.rrn,
      };
      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.PURCHASE,
          value: generateDataLayerObject({ items: item }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
}
