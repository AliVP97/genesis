import dayjs from 'dayjs';
import { SearchHistory } from 'module/hotel/ticketsSearchBox/interface';
import { useRouter } from 'next/router';
import { DATE_UTILS } from 'utils/helpers/dateUtils';

export const useGetSearchValues = (searchValue: null | SearchHistory) => {
  const { query } = useRouter();
  const destination = searchValue?.origin.city ?? decodeURIComponent(query?.cityName as string);
  let adultPassengers = 0;
  let childPassengers = 0;
  if (searchValue?.passenger) {
    for (let i = 0; i < searchValue?.passenger?.length; i++) {
      adultPassengers += searchValue.passenger[i].adult;
      childPassengers += searchValue.passenger[i].child.length;
    }
  }
  let passengerString = adultPassengers + ' بزرگسال ';
  if (childPassengers > 0) {
    passengerString += '،' + childPassengers + ' کودک ';
  }
  const adultConut = searchValue?.passenger
    ? Number(searchValue?.passenger.reduce((acc, curr) => acc + curr.adult, 0))
    : 0;

  const roomsCount = !searchValue?.passenger
    ? Array.isArray(query.rooms)
      ? query.rooms.length
      : query.rooms?.split('-').length || 0
    : searchValue?.passenger.length;

  let passengersCount = 0;

  if (searchValue?.passenger) {
    passengersCount =
      adultConut + Number(searchValue?.passenger.reduce((acc, curr) => acc + curr.child.length, 0));
  } else {
    const rooms = (Array.isArray(query.rooms) ? query.rooms.join('-') : query.rooms || '').split(
      '-',
    );
    passengersCount = rooms.reduce((total, room) => {
      const passengers = room.split(/,|___/);
      return total + passengers.length;
    }, 0);
  }

  const totalSeconds =
    Math.abs(
      Number(dayjs(searchValue?.returningDate)) - Number(dayjs(searchValue?.departureDate)),
    ) / 1000;

  const duration = Math.floor(totalSeconds / (60 * 60 * 24));

  const stayDate = `${DATE_UTILS.formatDate(searchValue?.departureDate as unknown as number, {
    lang: 'fa',
    showWeekDay: true,
    showYear: false,
  })} - ${DATE_UTILS.formatDate(searchValue?.returningDate as unknown as number, {
    lang: 'fa',
    showWeekDay: true,
    showYear: false,
  })}`;
  return {
    duration,
    destination,
    stayDate,
    passengerString,
    passengersCount,
    roomsCount,
    adultConut,
  };
};
