import { QUERY_TRIP_TYPES } from 'module/internationalFlight/search/constants/common';
import { QueryTripType, TripType } from '../../../types/common';

const getTripType = (tripType: QueryTripType): TripType =>
  tripType === QUERY_TRIP_TYPES.ONE_WAY ? 'oneway' : 'round-trip';

export default getTripType;
