import { useRouter } from 'next/router';
import { SearchQuery } from '../../../types/common';
import SERVER_SIDE_VALIDATOR_REGEXES from 'utils/handlePageValidation/constants/serverSideValidatorRegexes';
import { SearchLocationQuery } from '../types/common';
import { QUERY_LOCATION_TYPES } from 'module/internationalFlight/search/constants/common';

/**
 * Get the id from the router query this id can be defined in url params or in
 * the url search params. While both iatas are available then this should be
 * consider full data including destination and origin otherwise determine as
 * destination only.
 * @returns IataCodes object with originIata, destinationType, originType,
 * destinationIata,
 */
const useSearchLocationQueries = (): SearchLocationQuery[] => {
  const query = useRouter().query as SearchQuery & { id: string };

  const { id, originType, destinationType } = query;
  const result = id?.match(SERVER_SIDE_VALIDATOR_REGEXES.IATA_CODES_GROUP);
  const [, first, second] = result ?? [];

  // If the second match is available then this should have both origin and
  // destination.
  if (second) {
    return [
      { iataCode: first, locationType: originType },
      { iataCode: second, locationType: destinationType },
    ];
  }

  // First match is used whenever only destination is available and first
  // value is defined as destination. The destination iata only is passed to
  // get search locations to get data and the default location type is city
  // for that.
  return [{ iataCode: first, locationType: QUERY_LOCATION_TYPES.CITY }];
};

export default useSearchLocationQueries;
