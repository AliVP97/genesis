import { useMemo } from 'react';
import { AddPassengerResponse } from 'services/passenger/interface';
import { passengerExtractor } from '../utils/passengerExtractor';
import { definitions } from 'types/passenger';
import { Passenger } from 'assets/icons';
type UsePassenger = {
  filter: string;
  list?: AddPassengerResponse[];
};
type Passenger = definitions['passengerInternalPassengerModel'];
export type PassengerModel = Passenger & {
  nationalityTitle?: string;
  birthdayHijri?: string;
};
const usePassenger = (args: UsePassenger) => {
  const { list, filter } = args;
  const passengers = useMemo(() => {
    const allPassenger: PassengerModel[] = [];
    list?.forEach((item) => {
      const passenger = passengerExtractor(item.fields);
      if (passenger) {
        passenger.id = item.id;
        passenger.ageType = item.ageType;
      }

      allPassenger.push(passenger as PassengerModel);
    });

    return allPassenger?.filter((item) => {
      const fullNameEnglish = `${item.englishName ?? ''} ${item.englishFamily ?? ''}`.toLowerCase();
      const fullNamePersian = `${item.persianName ?? ''} ${item.persianFamily ?? ''}`;
      return (
        fullNameEnglish.includes(filter.toLowerCase()) || // Match full English name
        fullNamePersian.includes(filter) || // Match full Persian name
        item.englishName?.toLowerCase().includes(filter.toLowerCase()) ||
        item.englishFamily?.toLowerCase().includes(filter.toLowerCase()) ||
        item.persianName?.includes(filter) ||
        item.persianFamily?.includes(filter)
      );
    });
  }, [list, filter]);
  return passengers;
};

export default usePassenger;
