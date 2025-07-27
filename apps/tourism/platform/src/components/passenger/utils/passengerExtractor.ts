import { AddPassengerFields } from 'services/passenger/interface';
import { PassengerModel } from '../hooks/usePassenger';
export const passengerExtractor = (arr?: AddPassengerFields): PassengerModel | void => {
  if (!arr) {
    return;
  }
  const obj: Record<string, string> = {};
  arr.forEach((item) => {
    if (item?.id) {
      if (item.id === 'birthday' && item.valueHijri) {
        obj['birthdayHijri'] = item.valueHijri;
      } else if (item.id === 'nationality' && item.options) {
        obj['nationalityTitle'] = item?.options[0]?.title || '';
      }
      obj[item?.id] = item?.value || '';
    }
  });
  return obj;
};
