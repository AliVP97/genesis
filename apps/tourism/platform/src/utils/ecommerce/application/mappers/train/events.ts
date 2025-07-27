import { Currency } from 'utils/ecommerce/domain/constants';
import { ITrainTrackingRepository } from 'utils/ecommerce/domain/repositories';
import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { rajaTrainList, trainViewListItemModel } from './types';
import { captureException } from 'utils/ecommerce/errorHandeling';
import { generateDataLayerObject } from './helper';
import { IPurchasePropsModel } from 'utils/ecommerce/domain/models';

export class TrainTrackingEvent implements ITrainTrackingRepository {
  addToCart(item: trainViewListItemModel): void {
    const { selectedTrain, query, itemPosition } = item;
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.ADD_TO_CART,
        value: generateDataLayerObject({
          tickets: selectedTrain as rajaTrainList,
          query,
          itemPosition,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }

  viewItemList(items: trainViewListItemModel): void {
    const { query } = items;
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
        value: generateDataLayerObject({
          tickets: items.data as rajaTrainList,
          query,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }

  selectItem(item: trainViewListItemModel): void {
    const { viewDetail, query, itemPosition } = item;

    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.SELECT_ITEM,
        value: generateDataLayerObject({
          tickets: viewDetail as rajaTrainList,
          query,
          itemPosition,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }

  viewCart(item: trainViewListItemModel, passengerLength?: number): void {
    const { selectedTrain, query, itemPosition } = item;
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_CART,
        value: generateDataLayerObject({
          tickets: selectedTrain as rajaTrainList,
          query,
          itemPosition,
          passengerLength,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addPaymentInfo(
    item: trainViewListItemModel,
    paymentMethod: string | undefined,
    passengerLength?: number,
  ): void {
    const { selectedTrain, query, itemPosition } = item;
    try {
      const optional = {
        payment_type: paymentMethod,
      };

      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
          value: generateDataLayerObject({
            tickets: selectedTrain as rajaTrainList,
            query,
            itemPosition,
            passengerLength,
          }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
  beginCheckout(item: trainViewListItemModel, passengerLength?: number): void {
    const { selectedTrain, query, itemPosition } = item;
    try {
      createTrackingEvent({
        type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
        value: generateDataLayerObject({
          tickets: selectedTrain as rajaTrainList,
          query,
          itemPosition,
          passengerLength,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  purchase(
    item: trainViewListItemModel,
    props: IPurchasePropsModel,
    passengerLength?: number,
  ): void {
    const { selectedTrain, query, itemPosition } = item;
    try {
      const optional = {
        currency: Currency.TRY,
        value: parseInt(`${props?.price ?? '0'}`),
        transaction_id: props?.rrn,
      };

      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.PURCHASE,
          value: generateDataLayerObject({
            tickets: selectedTrain as rajaTrainList,
            query,
            itemPosition,
            passengerLength,
          }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
}
