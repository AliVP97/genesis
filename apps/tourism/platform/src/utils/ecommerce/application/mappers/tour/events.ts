import { Services } from 'utils/ecommerce/domain/constants';
import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { isOneDatCase, TOUR_DAY_TIME } from './constants';
import { TPackageItem, TtourPackageListResponse } from 'services/tour/register/interface';
import { definitions } from 'types/tour';

const checkIsOneDay = (hotel_name: string | number | undefined) => {
  if (isOneDatCase.includes(hotel_name)) {
    return TOUR_DAY_TIME.ONEDAY;
  }
  return hotel_name;
};

export class TourTrackingEvent {
  removeFromCart(items: TPackageItem, tourId: string): void {
    const { hotelName, adultSinglePrice, transportation, nightCount, packageDateId } = items || {};

    const dataLayerObject = {
      item_name: checkIsOneDay(hotelName),
      item_id: `${tourId}`,
      price: parseInt(adultSinglePrice as string),
      item_category2: transportation,
      item_category3: nightCount,
      item_list_name: 'tour_title',
      item_list_id: `${packageDateId}`,
      index: 0,
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.REMOVE_FROM_CART,
      value: dataLayerObject,
    });
  }

  beginCheckout(items: TPackageItem, tourId: string): void {
    const { hotelName, transportation, adultSinglePrice, packageDateId, nightCount } = items || {};

    const dataLayerObject = {
      item_id: `${tourId}`,
      item_name: checkIsOneDay(hotelName),
      index: 0,
      item_brand: 'name_en',
      item_category: `${Services.TOUR} ${'type'}`,
      item_category2: transportation,
      item_category3: nightCount,
      item_list_id: `${packageDateId}`,
      item_list_name: 'tour_title',
      price: parseInt(adultSinglePrice as string),
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
      value: dataLayerObject,
    });
  }

  addToCart(): void {
    const dataLayerObject = {
      item_id: 'book id',
      item_name: 'تورمشهد (ریلی) با امکان خرید اقساط',
      item_list_name: ' خدمات ویژه - نوع حمل و نقل - مدت تور',
      item_list_id: 'خدمات ویژه - نوع حمل و نقل - مدت تور',
      item_brand: 'transport type',
      item_category: 'Tour Domestic or Int Tour',
      Item_category2: 'میل تایپ',
      item_category3: 'tehran',
      item_category4: 'istanbul',
      Item_variant: 'امکانات تور',
      price: 123750000,
      index: 1,
      quantity: '',
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.ADD_TO_CART,
      value: dataLayerObject,
    });
  }

  viewItemList(items: TtourPackageListResponse): void {
    const dataLayerObject = items?.packages?.map((program, index) => {
      return {
        item_name: checkIsOneDay(program.hotelName),
        item_id: `${index}`,
        price: parseInt(program?.adultSinglePrice as string),
        item_brand: program.hotelName,
        item_list_id: `${index}`,
        item_list_name: program.hotelName,
        index: index,
        item_category: `${Services.TOUR} ${'type'}`,
      };
    });
    createTrackingEvent({
      type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
      value: dataLayerObject,
    });
  }

  selectItem(
    items: definitions['tourSearchResponseData'],
    origin: string,
    destination: string,
  ): void {
    const { id, title, facilities, transport, basePrice } = items;
    const dataLayerObject = {
      item_id: id,
      item_name: title,
      item_list_name: facilities,
      item_list_id: facilities,
      item_brand: transport?.type,
      item_category2: '',
      item_category3: origin,
      item_category4: destination,
      Item_variant: facilities,
      price: basePrice,
      index: 1,
    };
    createTrackingEvent({
      type: BaseTrackingEventActionsType.SELECT_ITEM,
      value: dataLayerObject,
    });
  }

  addPaymentInfo(items: TPackageItem): void {
    const { hotelName, transportation, nightCount, packageDateId } = items;
    const dataLayerObject = {
      item_id: `${packageDateId}`,
      item_name: checkIsOneDay(hotelName),
      index: 0,
      item_brand: 'name_en',
      item_category: `${Services.TOUR} ${'type'}`,
      item_category2: transportation,
      item_category3: nightCount,
      item_list_id: `${packageDateId}`,
      item_list_name: 'tour_title',
      price: 'totalPrice',
      quantity: 'quantity',
    };
    const optional = {
      payment_type: 'paymentType',
    };
    createTrackingEvent(
      {
        type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
        value: dataLayerObject,
      },
      optional,
    );
  }
}
