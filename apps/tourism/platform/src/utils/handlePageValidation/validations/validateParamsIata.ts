import SERVER_SIDE_VALIDATOR_REGEXES from '../constants/serverSideValidatorRegexes';
import {
  CMSData,
  ServerSideValidator,
  ServerSideValidatorResult,
  ServerSideValidatorWithContext,
} from '../types/common';

/**
 * Get cms data by first iata code and return cms data to landing page. if cms
 * data is not available, return undefined.
 * todo: here we decide to  return undefined. this should be implemented to
 * consider in the code other logic related to this is implemented.
 * @param first - The first IATA code.
 * @returns A cms data to present in landing page.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCMSData = (_first: string): CMSData | undefined => {
  return undefined;
};

const validateFirst = (first: string, normFirst: string): ServerSideValidatorResult => {
  // todo: api call or cms call to get data for cms. should be implemented to
  // determine cmsData to landing page if that is available.
  const cmsData = getCMSData(first);

  // Case 1: Single IATA code or cms-only route
  if (cmsData) {
    return {
      isValid: true,
      skipValidations: true,
      props: { cmsData: cmsData, isSingleIata: true },
    };
  }

  // Case 2: first is not a valid IATA code
  if (first.length !== 3) {
    return { isValid: false };
  }

  // Case 3: first is a valid IATA code
  // Not set isSingleIata in props because this should be corrected in the next
  // call and make that permanent in route.
  if (first !== normFirst) {
    return { isValid: true, correctRoute: normFirst, skipValidations: true };
  }

  return {
    isValid: true,
    skipValidations: true,
    props: { isSingleIata: true },
  };
};

/**
 * Validates the provided IATA code string without any additional context.
 *
 * This function performs various checks on the input IATA code string to ensure it
 * is valid. It handles cases such as single IATA codes, two IATA codes, and
 * normalizes the codes if needed.
 *
 * @param value - The IATA code string to validate.
 * @returns A validation result object indicating whether the input is valid, and
 * any necessary corrections to the route.
 */
export const validateWithoutContext: ServerSideValidator<string> = (value) => {
  const result = value.match(SERVER_SIDE_VALIDATOR_REGEXES.IATA_CODES_GROUP);

  if (!result) {
    return { isValid: false };
  }

  const [, first, second] = result;
  const normFirst = first.toUpperCase();
  const normSecond = second?.toUpperCase();

  // Case 1: Single IATA code or cms-only route
  if (first && !second) {
    return validateFirst(first, normFirst);
  }

  // Case 2: first is not a valid IATA code
  if (first.length !== 3) {
    return { isValid: false };
  }

  // Case 3: Two identical codes are invalid
  if (first === second) {
    return { isValid: false };
  }

  // Case 4: Two IATA codes provided—normalize if needed
  if (first !== normFirst || second !== normSecond) {
    return { isValid: true, correctRoute: `${normFirst}-${normSecond}` };
  }

  // Case 5: When value doesn't start with "first-second", fix the route format
  if (!value.startsWith(`${first}-${second}`)) {
    return { isValid: true, correctRoute: `${first}-${second}` };
  }

  return { isValid: true };
};

/**
 * Validates the IATA code parameters in the request context.
 *
 * @param key - The key in the request params object to validate.
 * @returns A function that takes the request context and validates the IATA code parameter.
 */
const validateParamsIata =
  (key: string): ServerSideValidatorWithContext =>
  ({ params }) =>
    validateWithoutContext(params[key]);

export default validateParamsIata;
