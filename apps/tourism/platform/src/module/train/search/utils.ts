import dayjs from 'dayjs';
import jalaliday from 'jalali-plugin-dayjs';
import { camelCase } from 'lodash';
import { z } from 'zod';

import { TRAIN_MAX_PASSENGER, trainPassengerValidation } from 'utils/helpers/validations';

dayjs.extend(jalaliday);

const refineReturningDate = (
  data: z.infer<typeof trainSearchUrlBaseSchema> | z.infer<typeof trainSearchQueryBaseSchema>,
) => {
  // check returning date
  if (data.returningDate) {
    const { departureDate, returningDate } = data;

    const departureDateObj = dayjs(departureDate, { jalali: true });
    const aDayAfterDepartureDate = departureDateObj
      .add(1, 'day')
      .calendar('jalali')
      .format('YYYY-MM-DD');

    if (!/^\d{4}-\d{2}-\d{2}$|^$/.test(returningDate)) {
      data.returningDate = aDayAfterDepartureDate;
      return true;
    }

    const returningDateObj = dayjs(returningDate, { jalali: true });

    if (returningDateObj.isBefore(departureDateObj)) {
      data.returningDate = aDayAfterDepartureDate;
      return true;
    }
  } else if (data.returningDate === '') {
    delete data.returningDate;
    return true;
  }

  return true;
};

export const reduceToMaxPassenger = (
  passengers: PassengerCounts,
  maxPassenger = TRAIN_MAX_PASSENGER,
): PassengerCounts => {
  const { adult, child, infant } = passengers;
  const total = adult + child + infant;

  // Function to reduce a value without going below 0
  const reduceValue = (value: number, reduction: number): number => {
    return Math.max(0, value - reduction);
  };

  // Reduce in order: infant -> child -> adult
  let remainingReduction = Math.max(0, total - maxPassenger);

  let newInfant = infant;
  if (remainingReduction > 0) {
    newInfant = reduceValue(infant, remainingReduction);
    remainingReduction -= infant - newInfant;
  }

  let newChild = child;
  if (remainingReduction > 0) {
    newChild = reduceValue(child, remainingReduction);
    remainingReduction -= child - newChild;
  }

  let newAdult = adult;
  if (remainingReduction > 0) {
    newAdult = reduceValue(adult, remainingReduction);
  }

  return {
    adult: newAdult,
    child: newChild,
    infant: newInfant,
  };
};

const refinePassenger = (
  data: z.infer<typeof trainSearchUrlBaseSchema> | z.infer<typeof trainSearchQueryBaseSchema>,
): boolean => {
  const passenger = {
    adult: Number(data.adult),
    child: Number(data.child),
    infant: Number(data.infant),
  };

  try {
    trainPassengerValidation(passenger);
  } catch {
    const refinedCounts = reduceToMaxPassenger(passenger);

    data.adult = String(refinedCounts.adult);
    data.child = String(refinedCounts.child);
    data.infant = String(refinedCounts.infant);
  }

  return true;
};

type PassengerCounts = {
  adult: number;
  child: number;
  infant: number;
};

const strictFormatDate = (value: string) => {
  const convertedValue = dayjs(value, { jalali: true }).calendar('jalali').format('YYYY-MM-DD');

  if (value !== convertedValue) {
    return convertedValue;
  }
  return value;
};

const trainSearchUrlBaseSchema = z.object({
  id: z.string().regex(/^[a-z_]+-[a-z_]+$/),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform(strictFormatDate)
    .refine((value) => {
      const today = dayjs().startOf('day');
      const date = dayjs(value, { jalali: true });

      return !date.isBefore(today);
    })
    .catch(dayjs().calendar('jalali').format('YYYY-MM-DD')),
  returningDate: z.string().transform(strictFormatDate).optional(),
  gender: z
    .string()
    .toUpperCase()
    .default('COMPARTMENT_GENDER_FAMILY')
    .pipe(
      z.enum([
        'COMPARTMENT_GENDER_UNDEFINED',
        'COMPARTMENT_GENDER_MEN_ONLY',
        'COMPARTMENT_GENDER_WOMEN_ONLY',
        'COMPARTMENT_GENDER_FAMILY',
      ]),
    )
    .catch('COMPARTMENT_GENDER_FAMILY'),
  adult: z.coerce
    .number()
    .gte(1)
    .default(1)
    .transform((num) => Math.floor(num).toString())
    .catch('1'),
  child: z.coerce
    .number()
    .gte(0)
    .default(0)
    .transform((num) => Math.floor(num).toString())
    .catch('0'),
  infant: z.coerce
    .number()
    .gte(0)
    .default(0)
    .transform((num) => Math.floor(num).toString())
    .catch('0'),
  wantCompartment: z.coerce
    .string()
    .toLowerCase()
    .default('false')
    .pipe(z.enum(['true', 'false']))
    .catch('false'),
  sort: z
    .string()
    .transform((value) => camelCase(value))
    .pipe(z.enum(['lowPrice', 'highPrice', 'earliestTime', 'recentTime']))
    .optional()
    .catch('lowPrice'),
});

export const trainSearchUrlSchema = trainSearchUrlBaseSchema
  .refine(refineReturningDate)
  .refine(refinePassenger);

export const trainSearchQueryBaseSchema = trainSearchUrlBaseSchema.omit({
  id: true,
});

export const trainSearchQuerySchema = trainSearchQueryBaseSchema
  .refine(refineReturningDate)
  .refine(refinePassenger);

export type TTrainSearchQuery = z.infer<typeof trainSearchQuerySchema>;
export type TTrainUrlQuery = z.infer<typeof trainSearchUrlSchema>;
