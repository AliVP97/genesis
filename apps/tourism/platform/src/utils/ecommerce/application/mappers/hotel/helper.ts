import { generateItemListName } from 'utils/ecommerce/domain/utils';
import { CONSTANT, hotelViewListItemModel, IMapQueryToObject, THotelList } from './types';
import { ParsedUrlQuery } from 'querystring';

const mapQueryToObject = (query: ParsedUrlQuery): IMapQueryToObject => {
  const { facilities, stars, sort } = query;
  return {
    facilities: (facilities as string) ?? '',
    stars: (stars as string) ?? '',
    sort: (sort as string) ?? '',
  };
};

export const generateDataLayerObject = (tickets: hotelViewListItemModel, priceProps?: number) => {
  const { query, data, quantity, itemPosition } = tickets;
  const { sort, facilities, stars } = mapQueryToObject(query);
  const itemListText = generateItemListName([sort, facilities, stars]);

  const object = {
    item_list_name: itemListText,
    item_list_id: itemListText,
  };
  return data?.map((ticket: THotelList, index: number) => {
    const { name, hotelId, star, city, priceDetail } = ticket;
    const price = priceProps ? priceProps : priceDetail?.totalPrice;
    return {
      ...object,
      item_id: hotelId,
      item_name: name,
      item_category: CONSTANT.DOMESTIC_HOTEL,
      item_category2: star,
      item_category3: city?.name,
      price: parseInt(`${price}`),
      index: itemPosition ?? index,
      quantity: quantity,
    };
  });
};

export const passengerCounter = (query: ParsedUrlQuery) => {
  const searchInfo = query?.rooms;
  const passengers = `${searchInfo}`?.split('-')?.map((room: string) => ({
    Adult: room?.split(',').length,
    Child: room?.includes('CHILD') ? room?.split('+CHILD_')?.length : 0,
  }));

  return passengers[0];
};
