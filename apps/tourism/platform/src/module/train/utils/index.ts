import { z } from 'zod';

import { queryClient } from 'pages/_app';
import { stationQuery } from 'services/train/stations';
import { TTrainStations } from 'services/train/stations/interface';
import { definitions } from 'types/rajatrain';
import { TTrainUrlQuery } from '../search/utils';
import { TLocation, TSearchObject } from './types';

const locationSchema = z.object({
  origin: z.object({
    code: z.string().catch(''),
    farsiName: z.string().catch(''),
    englishName: z.string().catch(''),
  }),
  destination: z.object({
    code: z.string().catch(''),
    farsiName: z.string().catch(''),
    englishName: z.string().catch(''),
  }),
});

const seoCodeToStation = async (seoCode: string): Promise<TTrainStations> =>
  queryClient.fetchQuery(stationQuery(seoCode));

export const queryToLocation = async (query: TTrainUrlQuery): Promise<TLocation> => {
  if (query.id === undefined) {
    throw new Error('id in undefined');
  }

  const [originCode, destinationCode] = query.id?.split('-');

  const [origin, destination] = await Promise.all([
    !!originCode && seoCodeToStation(originCode),
    !!destinationCode && seoCodeToStation(destinationCode),
  ]);

  if (origin && destination) {
    if (
      originCode !== origin?.stations?.[0]?.englishName ||
      destinationCode !== destination?.stations?.[0]?.englishName
    ) {
      throw new Error('location not found');
    }

    if (origin?.stations?.[0] && destination?.stations?.[0]) {
      return locationSchema.parse({
        origin: origin?.stations?.[0],
        destination: destination?.stations?.[0],
      });
    }
  }

  return {
    origin: { code: '', farsiName: '', englishName: '' },
    destination: { code: '', farsiName: '', englishName: '' },
  };
};

export const queryToState = async (query: TTrainUrlQuery): Promise<TSearchObject> => {
  let location: TLocation = {
    origin: { code: '', farsiName: '', englishName: '' },
    destination: { code: '', farsiName: '', englishName: '' },
  };

  try {
    location = await queryToLocation(query);
  } catch (error) {}

  return {
    ...location,
    departureDate: query.departureDate,
    returningDate: query.returningDate,
    adult: Number(query.adult),
    child: Number(query.child),
    infant: Number(query.infant),
    wantCompartment: query.wantCompartment === 'true',
    compartmentGenderType: query.gender,
  };
};

export const tariffPersianName: Record<definitions['rajaTariff'], string> = {
  TARIFF_UNSPECIFIED: 'نامشخص',
  TARIFF_ADULT: 'بزرگسال',
  TARIFF_CHILD: 'کودک',
  TARIFF_EMPTY: 'کسری کوپه',
  TARIFF_INFANT: 'نوزاد',
  TARIFF_ADULT_FOREIGN: 'بزرگسال (غیرایرانی)',
  TARIFF_CHILD_FOREIGN: 'کودک (غیرایرانی)',
  TARIFF_INFANT_FOREIGN: 'نوزاد (غیرایرانی)',
};
