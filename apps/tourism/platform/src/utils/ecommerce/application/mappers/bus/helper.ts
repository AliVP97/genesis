import { Services } from 'utils/ecommerce/domain/constants';
import { generateItemListName, totalPassenger } from 'utils/ecommerce/domain/utils';
import { ParsedUrlQuery } from 'querystring';
import { IBusGenerateDataLayerProps, IBusMapQueryToObject } from './types';

const mapQueryToObject = (query: ParsedUrlQuery): IBusMapQueryToObject => {
  const { departureTimeRanges, busTypes, sort } = query;
  return {
    departureTimeRanges: (departureTimeRanges as string) ?? '',
    busTypes: (busTypes as string) ?? '',
    sort: (sort as string) ?? '',
    quantity: totalPassenger(query),
  };
};

export const generateDataLayerObject = ({ tickets, quantityProps }: IBusGenerateDataLayerProps) => {
  const { query, data, itemPosition, passengerLength } = tickets;
  const { sort, departureTimeRanges, busTypes } = mapQueryToObject(query);
  const itemListText = generateItemListName([sort, departureTimeRanges, busTypes]);

  const object = {
    item_list_name: itemListText,
    item_list_id: itemListText,
  };
  return data?.map((ticket, index: number) => {
    const {
      isInternational,
      price,
      companyName,
      originCity,
      destinationCity,
      originStation,
      busType,
      busId,
      destinationStation,
    } = ticket;

    return {
      ...object,
      item_id: busId,
      item_name: generateItemListName([originStation as string, destinationStation as string]),
      item_brand: companyName,
      item_category: isInternational ? Services.INTERNATIONAL_BUS : Services.DOMESTIC_BUS,
      item_category2: busType,
      item_category3: originCity,
      item_category4: destinationCity,
      price: price ? parseInt(price as string) : 0,
      index: itemPosition ?? index,
      quantity: quantityProps ?? passengerLength,
    };
  });
};
