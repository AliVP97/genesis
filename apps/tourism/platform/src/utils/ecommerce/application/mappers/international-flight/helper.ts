import {
  CHARTER,
  ONE_WAY_TRIP,
  ROUNDED_TRIP,
  Services,
  SYSTEM,
  TripModeEnum,
} from 'utils/ecommerce/domain/constants';
import {
  IInternationalFlightGenerateDataLayerProps,
  IInternationalFlightMapQueryToObject,
  viewItemListModel,
} from './types';
import { generateItemListName, totalPassenger } from 'utils/ecommerce/domain/utils';
import { ParsedUrlQuery } from 'querystring';

const tripdModeTextGenerator = (
  departureTime: string,
  returningTime: string,
  mode: string,
): string => {
  return mode === TripModeEnum.two ? `${departureTime}-${returningTime}` : `${departureTime}`;
};
export const mapQueryToObject = (query: ParsedUrlQuery): IInternationalFlightMapQueryToObject => {
  // For calculating passengersSeats passenger number should multiple with 2
  // if trip mode is a round-trip ticke
  const {
    tripMode,
    departureTime,
    returningTime,
    departureStops,
    returningStops,
    sort,
    cabinType,
  } = query;
  const passengers = totalPassenger(query);
  return {
    sort: (sort as string) ?? '',
    passengers: passengers,
    tripTime: tripdModeTextGenerator(
      departureTime as string,
      returningTime as string,
      tripMode as string,
    ),
    tripStop: tripdModeTextGenerator(
      departureStops as string,
      returningStops as string,
      tripMode as string,
    ),
    ticketType: (cabinType as string) ?? '',
    mode: tripMode === TripModeEnum.two ? (ROUNDED_TRIP as string) : (ONE_WAY_TRIP as string),
    quantity: tripMode === TripModeEnum.two ? 2 * passengers : passengers,
  };
};

export const checkIsCharter = (
  returnFlightIsCharter: boolean | undefined,
  leavingFlightIsCharter: boolean | undefined,
  mode: string,
) => {
  const isLeavingCharter = leavingFlightIsCharter ? CHARTER : SYSTEM;
  const isReturnCharter = returnFlightIsCharter ? CHARTER : SYSTEM;

  if (mode === ROUNDED_TRIP) {
    return `${isLeavingCharter}-${isReturnCharter}`;
  } else {
    return isLeavingCharter;
  }
};

export const generateDataLayerObject = ({ items }: IInternationalFlightGenerateDataLayerProps) => {
  const {
    ticketsData: { itineraries, airlineDictionary },
    query,
    locations,
    itinerary,
    itemPosition,
  } = items;

  const { tripTime, tripStop, sort, ticketType, quantity, mode } = mapQueryToObject(query);

  const splitedTicketType = ticketType ? ticketType?.split('_').slice(-1)[0] : '';

  const itemListText = generateItemListName([tripTime, tripStop, sort, splitedTicketType]);
  const object = {
    item_list_name: itemListText,
    item_list_id: itemListText,
    item_category3: locations?.origin?.data?.['cityTitle'],
    item_category4: locations?.destination?.data?.['cityTitle'],
    quantity: quantity,
    item_category: Services.INTERNATIONAL_FLIGHT,
  };

  const tickets = itinerary ? [itinerary] : itineraries;
  const dataLayerObject = tickets?.map((ticket, indx) => {
    const { returningFlight, priceInfo, leavingFlight } = ticket;

    const leavingAirlineCode = leavingFlight?.segments?.[0]?.marketingAirlineCode;
    const airLinebrand = `${airlineDictionary![leavingAirlineCode!]?.name?.persian ?? ''}`.trim();

    let isCharter;
    if ('isCharter' in ticket) {
      isCharter = ticket.isCharter ? CHARTER : SYSTEM;
    } else {
      isCharter = checkIsCharter(
        (returningFlight as NonNullable<viewItemListModel['itinerary']>['leavingFlight'])
          ?.isCharter,
        (returningFlight as NonNullable<viewItemListModel['itinerary']>['leavingFlight'])
          ?.isCharter,
        mode,
      );
    }

    return {
      ...object,
      item_id: ticket.itineraryId,
      item_name: isCharter,
      item_brand: airLinebrand,
      item_category: Services.INTERNATIONAL_FLIGHT,
      item_category2: mode,
      price: priceInfo?.price,
      index: itemPosition ?? indx,
    };
  });
  return dataLayerObject;
};
