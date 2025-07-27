import { ParsedUrlQuery } from 'querystring';
import { PersianWagonType } from 'module/train/tickets/interface';
import { Services } from 'utils/ecommerce/domain/constants';
import { generateItemListName, totalPassenger } from 'utils/ecommerce/domain/utils';
import {
  ITrainMapQueryToObject,
  ITrainGenerateDataLayerProps,
  rajaTrain,
  wagontTypeDefination,
} from './types';

const mapQueryToObject = (query: ParsedUrlQuery): ITrainMapQueryToObject => {
  const { wantCompartment, wagonTypes, departureTimeRanges, sort } = query;
  return {
    wantCompartment: (wantCompartment as string) ?? '',
    wagonTypes: (wagonTypes as string) ?? '',
    departureTimeRanges: (departureTimeRanges as string) ?? '',
    sort: (sort as string) ?? '',
    quantity: totalPassenger(query),
  };
};

export function generateDataLayerObject({
  tickets,
  query,
  itemPosition,
  passengerLength,
}: ITrainGenerateDataLayerProps) {
  const { sort, departureTimeRanges, wagonTypes, wantCompartment, quantity } =
    mapQueryToObject(query);
  const itemListText = generateItemListName([
    sort,
    departureTimeRanges,
    wagonTypes,
    wantCompartment,
  ]);

  const object = {
    item_list_name: itemListText,
    item_list_id: itemListText,
  };
  return tickets.map((ticket: rajaTrain, index: number) => {
    const { companyName, trainId, wagonType, wagonName, originName, destinationName, fare } =
      ticket;

    return {
      ...object,
      item_id: trainId,
      item_name: PersianWagonType[wagonType as wagontTypeDefination],
      item_brand: companyName,
      item_category: Services.DOMESTIC_TRAIN,
      item_category2: wagonName,
      item_category3: originName,
      item_category4: destinationName,
      price: parseInt(fare ?? '0'),
      index: itemPosition ?? index,
      quantity: passengerLength ?? quantity,
    };
  });
}
