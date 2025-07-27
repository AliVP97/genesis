import {
  ServerSideContext,
  ServerSideValidator,
  ServerSideValidatorWithContext,
} from '../types/common';
import { QUERY_TRIP_TYPES } from 'module/internationalFlight/search/constants/common';
import { QueryTripType } from 'module/internationalFlight/search/types/common';

type ValidateWithoutContextArguments = {
  tripMode: QueryTripType;
  returningDate: string;
};

const validateWithoutContext: ServerSideValidator<ValidateWithoutContextArguments> = ({
  tripMode,
  returningDate,
}) => {
  if (tripMode === QUERY_TRIP_TYPES.ROUND_TRIP && !returningDate) {
    return { isValid: false };
  }

  return { isValid: true };
};

export const validateQueryTripMode =
  (): ServerSideValidatorWithContext =>
  ({ query }: ServerSideContext) =>
    validateWithoutContext({
      returningDate: query.returningDate,
      tripMode: query.tripMode as QueryTripType,
    });

export default validateQueryTripMode;
