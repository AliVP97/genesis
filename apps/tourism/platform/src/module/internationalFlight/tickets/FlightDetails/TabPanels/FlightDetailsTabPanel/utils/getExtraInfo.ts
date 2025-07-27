import { CabinType, Flight } from 'module/internationalFlight/tickets/types/api';
import { ExtraInfo } from '../types/common';

const CABIN_TYPES: Record<CabinType, string> = {
  CABIN_TYPE_UNDEFINED: '',
  CABIN_TYPE_ECONOMY: 'اکونومی',
  CABIN_TYPE_PREMIUM: 'پریمیوم',
  CABIN_TYPE_BUSINESS: 'بیزینس',
  CABIN_TYPE_FIRST: 'فرست',
};

const getExtraInfo = (flight: Flight, fareClass: string | undefined): ExtraInfo => {
  const cabinType = CABIN_TYPES[flight.cabinType ?? 'CABIN_TYPE_UNDEFINED'];
  const charterOrSystemic = flight.isCharter ? 'چارتری' : 'سیستمی';
  const newFareClass = fareClass ? `کلاس نرخی: ${fareClass}` : '';

  return {
    fareClass: newFareClass,
    classification: `${cabinType} - ${charterOrSystemic}`,
  };
};

export default getExtraInfo;
