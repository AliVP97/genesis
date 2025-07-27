import { AirlineDictionary, AvailabilityListResponseV2, ItineraryV2 } from '../types/api';
import flatSegments from '../utils/flatSegments';

export type TTicket = {
  title: string | undefined;
  logo: string | undefined;
  price: string | undefined;
};

type Airline = {
  title: string;
  logo: string;
  price: number;
  isSelected: boolean;
  info: string;
  value: string;
};

function createAirline(
  airlineCode: string,
  price: number | undefined,
  dictionary: AirlineDictionary,
): Airline {
  const airlineDetail = dictionary?.[airlineCode];
  const title = airlineDetail?.name?.persian;
  const logo = airlineDetail?.logoUri;
  const info = `از ${Number(price).toLocaleString()} ریال`;

  return {
    title: title ?? '',
    logo: logo ?? '',
    price: price ?? 0,
    isSelected: false,
    info,
    value: title ?? '',
  };
}

export const useGetAirlines = (response: AvailabilityListResponseV2) => {
  const dictionary = response?.airlineDictionary;
  const uniqueAirlines: Record<string, Airline> = {};

  const newItineraries = JSON.parse(JSON.stringify(response?.itineraries) ?? '[]') as ItineraryV2[];

  newItineraries?.forEach((itinerary) => {
    const segments = flatSegments(itinerary);

    segments.forEach((segment) => {
      const airlineCode = segment.operatingAirlineCode;

      if (airlineCode) {
        const price = itinerary.priceInfo?.price;
        const prevAirline = uniqueAirlines[airlineCode];
        const airline = createAirline(airlineCode, price, dictionary);

        if (!prevAirline || prevAirline.price > airline.price) {
          uniqueAirlines[airlineCode] = airline;
        }
      }
    });
  });

  return {
    airlines: Object.values(uniqueAirlines),
  };
};
