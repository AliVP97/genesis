import { PASSENGER_LABELS } from '../constants/common';
import { PassengerType } from '../types/common';

const getPassengerTypeLabel = (passengerType: PassengerType | undefined) => {
  if (!passengerType || passengerType === 'PASSENGER_TYPE_UNDEFINED') {
    return '';
  }

  return PASSENGER_LABELS[passengerType] || '';
};

export default getPassengerTypeLabel;
