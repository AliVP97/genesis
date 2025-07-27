import {
  ServerSideContext,
  ServerSideValidator,
  ServerSideValidatorWithContext,
} from '../types/common';
import dayjs from 'dayjs';
import formatJalaliDate from '../utils/formatJalaliDate';
import getTodayTime from '../utils/getTodayTime';
import jalaliToTime from '../utils/jalaliToTime';

type ValidateWithoutContextArguments = {
  startKey: string;
  endKey?: string;
  query: Record<string, string>;
};

const validateDate = (startTime: number, todayTime: number, endTime: number | undefined) =>
  startTime >= todayTime && (!endTime || (endTime && endTime >= startTime));

/**
 * Validates and corrects a date range from a query object.
 *
 * @param params - Validation parameters.
 * @param params.startKey - The key in the query representing the start date.
 * @param [params.endKey] - The optional key in the query representing the end date.
 * @param params.query - The query object containing date values.
 * @returns [return.correctQuery] - If corrections are needed, this contains the corrected date values.
 *
 * @example
 * // Example usage:
 * const query = { departureDate: "1402-07-01", returnDate: "1402-07-10" };
 * const result = validateWithoutContext({ startKey: "departureDate", endKey: "returnDate", query });
 *
 * // If the start date is before today, it will be corrected to today's date.
 * // If the date range is invalid, adjustments are made to ensure a valid range.
 */
const validateWithoutContext: ServerSideValidator<ValidateWithoutContextArguments> = ({
  startKey,
  endKey,
  query,
}) => {
  const startDate = query[startKey];
  const todayTime = getTodayTime();
  const endDate = endKey && query[endKey];
  let endTime = endDate ? jalaliToTime(endDate) : undefined;
  let startTime = jalaliToTime(startDate);

  if (validateDate(startTime, todayTime, endTime)) {
    return { isValid: true };
  }

  if (!endDate) {
    return {
      isValid: true,
      correctQuery: { [startKey]: formatJalaliDate(todayTime) },
    };
  }

  const diff = dayjs(endTime).diff(dayjs(startTime), 'day');

  startTime = startTime < todayTime ? todayTime : startTime;
  endTime = dayjs(startTime).add(Math.abs(diff), 'day').toDate().getTime();

  return {
    isValid: true,
    correctQuery: {
      [startKey]: formatJalaliDate(startTime),
      [endKey]: formatJalaliDate(endTime),
    },
  };
};

/**
 * Creates a server-side validator that checks and corrects a date range
 * in the query parameters of a request.
 *
 * @param {string} startKey - The key in the query representing the start date.
 * @param {string} [endKey] - The optional key in the query representing the end date.
 * @returns {ServerSideValidatorWithContext} A function that validates the date range using the provided query context.
 *
 * @example
 * // Example usage:
 * const validator = validateQueryDateRange("departureDate", "returnDate");
 * const result = validator(context);
 *
 * // If the date range is invalid, it corrects it and returns the updated query.
 */
const validateQueryDateRange =
  (startKey: string, endKey?: string): ServerSideValidatorWithContext =>
  (context: ServerSideContext) =>
    validateWithoutContext({ startKey, endKey, query: context.query });

export default validateQueryDateRange;
