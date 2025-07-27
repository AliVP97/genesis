import { SearchQuery } from 'module/internationalFlight/search/types/common';
import { Passengers } from 'store/slices/internationalFlight/search';

const normalize = (value: string | undefined) => (value ? Number(value) : 0);

const getPassengers = ({
  infant,
  adult,
  child,
}: Pick<SearchQuery, 'infant' | 'adult' | 'child'>): Passengers => ({
  adult: normalize(adult),
  child: normalize(child),
  infant: normalize(infant),
});

export default getPassengers;
