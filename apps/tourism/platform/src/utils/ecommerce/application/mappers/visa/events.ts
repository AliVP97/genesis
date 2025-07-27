import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { IVisa, TVisaAddToCartEvent, VisaType } from './types';
import { IVisaTrackingRepository } from 'utils/ecommerce/domain/repositories';
import { Currency } from 'utils/ecommerce/domain/constants';
import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { VisaSpeceficConstants } from './constants';

const dataLayerObjectCreator = ({
  title,
  quantity,
  item_category2,
  item_varient,
  index,
}: {
  title: string;
  quantity?: number;
  item_category2?: number;
  item_varient?: string;
  index?: number;
}) => {
  const dataLayerObject = {
    item_id: `${title}`,
    item_name: `${title}`,
    item_list_name: VisaSpeceficConstants.VISA,
    item_list_id: VisaSpeceficConstants.VISA,
    item_category: VisaSpeceficConstants.VISA,
    index: index ?? 0,
    quantity: quantity ?? 0,
  };
  if (item_category2) {
    Object.assign(dataLayerObject, {
      item_category2: item_category2 === 0 ? VisaType.new : VisaType.renewal,
    });
  }
  if (item_varient)
    Object.assign(dataLayerObject, {
      item_varient,
    });

  return dataLayerObject;
};

export class VisaTracking implements IVisaTrackingRepository {
  viewItemList(items: Array<IVisa>): void {
    const dataLayerObject = items?.map((visa, index) => {
      const { visaTitle } = visa;
      return dataLayerObjectCreator({ title: visaTitle, index: index });
    });
    createTrackingEvent({
      type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
      value: dataLayerObject,
    });
  }

  selectItem(item: IVisa): void {
    createTrackingEvent({
      type: BaseTrackingEventActionsType.SELECT_ITEM,
      value: dataLayerObjectCreator({ title: item.visaTitle }),
    });
  }

  addToCart(item: TVisaAddToCartEvent): void {
    const { quantity, item_brand, item_category2, item_varient } = item;

    const dataLayerObject = {
      ...dataLayerObjectCreator({
        title: item_brand,
        quantity,
        item_category2,
        item_varient,
      }),
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.ADD_TO_CART,
      value: dataLayerObject,
    });
  }
  viewItem(item: IVisa): void {
    createTrackingEvent({
      type: BaseTrackingEventActionsType.VIEW_ITEM,
      value: dataLayerObjectCreator({ title: item.visaTitle }),
    });
  }
  addPaymentInfo(item: TVisaAddToCartEvent): void {
    const { quantity, item_brand, item_category2 } = item;
    const dataLayerObject = {
      ...dataLayerObjectCreator({ title: item_brand, quantity, item_category2 }),
    };
    const optional = {
      payment_type: VisaSpeceficConstants.VISA_PAYMENT_TYPE,
    };
    createTrackingEvent(
      {
        type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
        value: dataLayerObject,
      },
      optional,
    );
  }
  beginCheckout(item: TVisaAddToCartEvent): void {
    const { quantity, item_brand, item_category2, item_varient } = item;
    const dataLayerObject = {
      item_varient: '',
      ...dataLayerObjectCreator({
        title: item_brand,
        quantity,
        item_category2,
        item_varient,
      }),
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
      value: dataLayerObject,
    });
  }
  removeFromCart(item: TVisaAddToCartEvent): void {
    const { quantity, item_brand, item_category2, item_varient } = item;
    const dataLayerObject = {
      ...dataLayerObjectCreator({
        title: item_brand,
        quantity,
        item_category2,
        item_varient,
      }),
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.REMOVE_FROM_CART,
      value: dataLayerObject,
    });
  }
  purchase(item: TVisaAddToCartEvent): void {
    const { quantity, item_brand, item_category2, transactionID, item_varient } = item;
    const dataLayerObject = {
      ...dataLayerObjectCreator({
        title: item_brand,
        quantity,
        item_category2,
        item_varient,
      }),
    };
    const optional = {
      transaction_id: transactionID,
      value: 0,
      currency: Currency.TRY,
    };

    createTrackingEvent(
      {
        type: BaseTrackingEventActionsType.PURCHASE,
        value: dataLayerObject,
      },
      optional,
    );
  }
}
