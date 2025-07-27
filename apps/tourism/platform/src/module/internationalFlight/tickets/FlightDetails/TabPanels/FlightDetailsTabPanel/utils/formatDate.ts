import * as Sentry from '@sentry/nextjs';
import { FlightSegment } from 'module/internationalFlight/tickets/types/api';

type DateDetails = {
  persianDay: string;
  gregorianDate: string;
};

const DEFAULT_DATE_DETAILS: DateDetails = {
  persianDay: '',
  gregorianDate: '',
};

const getDateDetails = (datetime: string | undefined): DateDetails => {
  if (!datetime) {
    return DEFAULT_DATE_DETAILS;
  }

  try {
    const date = new Date(datetime);

    if (isNaN(date.getTime())) {
      return DEFAULT_DATE_DETAILS;
    }

    const persianDay = date.toLocaleDateString('fa-IR', { weekday: 'long' });
    const gregorianDate = date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
    });

    return {
      persianDay,
      gregorianDate,
    };
  } catch (error) {
    Sentry.captureException(error);
    return DEFAULT_DATE_DETAILS;
  }
};

const formatDate = (flightSegment: FlightSegment | undefined): string => {
  if (!flightSegment?.origin) {
    return '';
  }

  const { datetime, persianDate } = flightSegment.origin;
  const { persianDay, gregorianDate } = getDateDetails(datetime);

  return `${persianDay}، ${persianDate?.datePersian} (${gregorianDate})`;
};

export default formatDate;
