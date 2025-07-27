import { TTourPassenger } from './types';

type TValidationRule = (values: TTourPassenger) => boolean | string;

const MAX_TOTAL_PASSENGER = 9;
const UNDER_AGE_PER_ADULT = 3;

const validateTotalPassengers = (values: TTourPassenger) => {
  if (values.adult + values.child <= MAX_TOTAL_PASSENGER) {
    return true;
  }

  return `حداکثر تعداد مسافران ${MAX_TOTAL_PASSENGER} نفر است.`;
};

const validateTotalUnderAges = (values: TTourPassenger) => {
  if (values.child <= values.adult * UNDER_AGE_PER_ADULT) {
    return true;
  }

  return `به ازای هر بزرگسال، ${UNDER_AGE_PER_ADULT} کودک و یک نوزاد مجاز است.`;
};

const validationRules: TValidationRule[] = [validateTotalPassengers, validateTotalUnderAges];

export const validateRules: TValidationRule = (values) => {
  if (Object.keys(values).length) {
    for (const rule of validationRules) {
      const result = rule(values);

      if (typeof result === 'string') {
        return result; // Return the error message
      }
    }
    return true;
  }

  return false;
};
export const childAgeTypesOptions = [
  { value: '1', label: 'کمتر از 1 سال' },
  { value: '2', label: '1 تا 2 سال' },
  { value: '3', label: '2 تا 3 سال' },
  { value: '4', label: '3 تا 4 سال' },
  { value: '5', label: '4 تا 5 سال' },
  { value: '6', label: '5 تا 6 سال' },
  { value: '7', label: '6 تا 7 سال' },
  { value: '8', label: '7 تا 8 سال' },
  { value: '9', label: '8 تا 9 سال' },
  { value: '10', label: '9 تا 10 سال' },
  { value: '11', label: '10 تا 11 سال' },
  { value: '12', label: '11 تا 12 سال' },
];
