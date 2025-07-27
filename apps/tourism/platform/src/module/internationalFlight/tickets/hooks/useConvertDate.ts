import { FlightV2 } from '../types/api';
import getFlightTime from '../utils/getFlightTime';

export const useConvertDate = (flight?: FlightV2, targetComponent?: 'checkout' | 'tickets') => {
  const departureDate = flight?.origin && new Date(getFlightTime(flight.origin.flightDateTime));
  const arrivalDate =
    flight?.destination && new Date(getFlightTime(flight.destination.flightDateTime));

  const dayDifference: boolean =
    departureDate?.toLocaleDateString('fa-IR') !== arrivalDate?.toLocaleDateString('fa-IR');

  const departureFullTime = departureDate?.toLocaleDateString('fa-IR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const departureTime = departureDate?.toLocaleDateString('fa-IR', {
    month: 'long',
    day: '2-digit',
  });
  const arrivalFullTime = arrivalDate?.toLocaleDateString('fa-IR', {
    month: 'long',
    day: '2-digit',
    weekday: 'long',
    year: 'numeric',
  });
  const arrivalTime = arrivalDate?.toLocaleDateString('fa-IR', {
    month: 'long',
    day: '2-digit',
  });

  const flightDurationInHours = (flight && Math.floor(Number(flight?.duration) / 3600)) ?? 0;
  const flightDurationInMinutes =
    flight &&
    (Number(flight?.duration) % 3600 !== 0
      ? Math.abs(Number(flight?.duration) - flightDurationInHours * 3600) / 60
      : 0);

  function inCheckoutFormat() {
    if (!departureDate) {
      return;
    }

    const optionsArray: Intl.DateTimeFormatOptions[] = [
      { weekday: 'long' },
      { day: '2-digit' },
      { month: 'long' },
      { year: 'numeric' },
    ];

    const date = {} as Record<'weekday' | 'day' | 'month' | 'year' | string, string>;

    for (const opItem of optionsArray) {
      const datePartKey = Object.keys(opItem)[0];
      date[datePartKey] = departureDate.toLocaleDateString('fa-IR', opItem);
    }

    return `${date.weekday} ${date.day} ${date.month} ${date.year}`;
  }

  return {
    departureDate,
    arrivalDate,
    dayDifference,
    departureTime,
    arrivalTime,
    flightDurationInMinutes,
    arrivalFullTime,
    departureFullTime: targetComponent === 'checkout' ? inCheckoutFormat() : departureFullTime,
    flightDurationInHours,
  };
};
