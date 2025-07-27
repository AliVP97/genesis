import { TDictionary } from 'services/internationalFlight/flight/interface';
import { useEffect, useState } from 'react';
import { TIntelFlight, TIntelTicket } from 'services/internationalFlight/detail/interface';
import { PersianCabinType } from '../interface';
import { TripMode } from 'module/flights/travels/helper/travelHelper';

export const useCreateDetailData = (
  ticket: TIntelTicket,
  dictionary: TDictionary,
  isLoading: boolean,
) => {
  const [initData, setInitData] = useState<TIntelFlight[]>([]);
  useEffect(() => {
    if (
      ticket?.tripMode &&
      TripMode[
        ticket?.tripMode.toString() as
          | 'TRIP_MODE_ROUND_TRIP'
          | 'TRIP_MODE_UNDEFINED'
          | 'TRIP_MODE_ONEWAY'
      ] === 2
    )
      setInitData([ticket?.leavingFlight as TIntelFlight, ticket?.returningFlight as TIntelFlight]);
    else setInitData([ticket?.leavingFlight as TIntelFlight]);
  }, [ticket]);

  return initData?.length
    ? !isLoading &&
        initData?.map((item) => {
          return {
            originCity:
              (item?.origin?.iata &&
                dictionary?.iataDictionary![item?.origin?.iata]?.city?.name?.persian) ||
              item?.origin?.iata,

            destinationCity:
              (item?.destination?.iata &&
                dictionary?.iataDictionary![item?.destination?.iata]?.city?.name?.persian) ||
              item?.destination?.iata,
            durationHours: Math.floor(Number(item?.duration) / 3600),
            durationMinutes: Math.floor((Number(item?.duration) % 3600) / 60),
            segments:
              item?.segments?.map((segment) => {
                return {
                  codeShare: segment?.codeShare,
                  flightNumber: segment?.flightNumber,
                  originCity:
                    dictionary?.iataDictionary![segment.origin!.iata!]?.city?.name?.persian ||
                    segment.origin!.iata!,
                  destinationCity:
                    dictionary?.iataDictionary![segment.destination!.iata!]?.city?.name?.persian ||
                    segment.destination!.iata!,
                  departureDate: new Date(segment.origin?.datetime || '').toLocaleDateString(
                    'fa-IR',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    },
                  ),
                  departureEnglishDate: new Date(segment.origin?.datetime || '').toLocaleDateString(
                    'en-us',
                    {
                      day: 'numeric',
                      month: 'long',
                    },
                  ),
                  departureTime: segment.origin?.persianDate?.dateTimeString,
                  arrivalDate: new Date(segment.destination?.datetime || '').toLocaleDateString(
                    'fa-IR',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    },
                  ),
                  arrivalEnglishDate: new Date(
                    segment.destination?.datetime || '',
                  ).toLocaleDateString('en-us', {
                    month: 'long',
                    day: 'numeric',
                  }),
                  arrivalTime: segment.destination?.persianDate?.dateTimeString,
                  destinationStopDurationHour: Math.floor(
                    Number(segment.destinationStopDuration) / 3600,
                  ),
                  destinationStopDurationMinutes: Math.floor(
                    (Number(segment.destinationStopDuration) % 3600) / 60,
                  ),
                  durationHours: Math.floor(Number(segment?.duration) / 3600),
                  durationMinutes: Math.floor((Number(segment!.duration) % 3600) / 60),
                  logo:
                    dictionary?.airlineDictionary![segment.operatingAirlineCode!]?.logoUri ||
                    segment.operatingAirlineCode!,
                  isCharter: item.isCharter ? 'چارتری' : '',
                  cabinType: PersianCabinType[String(segment?.cabinType)],
                  fareClass: segment?.fareClass,
                  terminal: segment?.origin?.terminal ?? '-',
                  airplaneCode:
                    dictionary?.airlineDictionary![segment.aircraftCode!]?.name?.english ||
                    segment.aircraftCode!,
                  airline:
                    dictionary?.airlineDictionary![segment.operatingAirlineCode!]?.name?.english ||
                    segment.operatingAirlineCode!,
                  originAirport:
                    dictionary?.iataDictionary![segment.origin!.iata!]?.name?.persian ||
                    segment.origin!.iata!,
                  destinationAirport:
                    dictionary?.iataDictionary![segment.destination!.iata!]?.name?.persian ||
                    segment.destination!.iata!,
                  allowBaggage: segment?.baggageInfos?.map((info) => {
                    return {
                      passengerType: info.passengerType,
                      quantity: info.quantity,
                      description: info.description,
                      unit: info.unit,
                      weight: info.weight,
                      baggageDisplayText: info?.baggageDisplayText,
                    };
                  }),
                  technicalStop: segment?.technicalStop,
                  originIata: segment.origin?.iata,
                  destinationIata: segment.destination?.iata,
                  operatingAirlineCode: segment.operatingAirlineCode,
                };
              }) || [],
          };
        })
    : [];
};
