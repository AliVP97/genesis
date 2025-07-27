import { ParsedUrlQuery } from 'querystring';
import {
  domesticFlightInfoAggregator,
  IDomesticFlightGenerateDataLayerProps,
  IDomesticFlightMapQueryToObject,
} from './types';
import {
  CHARTER,
  ONE_WAY_TRIP,
  ROUNDED_TRIP,
  Services,
  SYSTEM,
} from 'utils/ecommerce/domain/constants';
import { generateItemListName, totalPassenger } from 'utils/ecommerce/domain/utils';

export const mapQueryToObject = (query: ParsedUrlQuery): IDomesticFlightMapQueryToObject => {
  const { flightClass, toward, backward, sort, ticketType, returningDate } = query;
  return {
    flightClass: (flightClass as string) ?? '',
    toward: (toward as string) ?? '',
    backward: (backward as string) ?? '',
    sort: (sort as string) ?? '',
    ticketType: (ticketType as string) ?? '',
    domesticFlightMode: returningDate ? (ROUNDED_TRIP as string) : (ONE_WAY_TRIP as string),
    quantity: totalPassenger(query),
  };
};

const isCharterText = (value: boolean | undefined): string => (value ? CHARTER : SYSTEM);

export const generateDataLayerObject = ({
  flights,
  query,
  locations,
  index,
  passengerLength,
}: IDomesticFlightGenerateDataLayerProps) => {
  const { domesticFlightMode, flightClass, toward, sort, quantity, ticketType, backward } =
    mapQueryToObject(query);

  const itemListText = generateItemListName([ticketType, flightClass, toward, backward, sort]);

  const object = {
    item_list_name: itemListText,
    item_list_id: itemListText,
    item_category3: locations?.origin?.city,
    item_category4: locations?.destination?.city,
    quantity: passengerLength ?? quantity,
    item_category: Services.DOMESTIC_FLIGHT,
  };
  return flights?.map((ticket, idx: number) => {
    const { price, isCharter, flightID, airline } = ticket;
    return {
      ...object,
      item_id: flightID,
      item_name: isCharterText(isCharter),
      item_brand: airline?.name ?? '',
      item_category: Services.DOMESTIC_FLIGHT,
      item_category2: domesticFlightMode,
      price: price,
      index: index ?? idx,
    };
  });
};

export const returnFlight = (ticketsData: domesticFlightInfoAggregator | undefined) => {
  if (!ticketsData || ticketsData.length === 0) {
    throw new Error('Domestic Flight query result does not exist or is invalid.');
  }
  return ticketsData;
};
