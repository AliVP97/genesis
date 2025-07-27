export const PersianCabinType: Record<string, string> = {
  CABIN_TYPE_UNDEFINED: '',
  CABIN_TYPE_ECONOMY: 'اکونومی',
  CABIN_TYPE_PREMIUM: 'پریمیوم',
  CABIN_TYPE_BUSINESS: 'بیزینس',
  CABIN_TYPE_FIRST: 'فرست',
};

export const PersianPassengerType: Record<string, string> = {
  PASSENGER_TYPE_UNDEFINED: '',
  PASSENGER_TYPE_ADULT: 'بزرگسال',
  PASSENGER_TYPE_CHILD: 'کودک',
  PASSENGER_TYPE_INFANT: 'نوزاد',
};

export enum TabType {
  DETAIL = 'DETAIL',
  POLICY = 'POLICY',
  VISA = 'VISA',
}

export interface Passengers {
  adult: number;
  child: number;
  infant: number;
}

export interface OptionTypes {
  value: string;
  title: string;
}
export const detailOptions = [
  {
    label: 'جزییات پرواز',
    value: TabType.DETAIL,
  },
  {
    label: 'قوانین استرداد',
    value: TabType.POLICY,
  },
  {
    label: 'ویزا و مسیر',
    value: TabType.VISA,
  },
];

export const options: OptionTypes[] = [
  {
    value: 'lowPrice',
    title: 'ارزان ترین',
  },
  {
    value: 'fast',
    title: 'سریع ترین',
  },
  // temporarily commented:
  /* {
    value: 'highPrice',
    title: 'گران ترین',
  }, */
  {
    value: 'earliestTime',
    title: 'زودترین',
  },
  {
    value: 'recentTime',
    title: 'دیرترین',
  },
];

export interface initialDetailData {
  originCity: string;
  destinationCity: string;
  durationHours: string;
  durationMinutes: string;
  segments: initialDetailSegments[];
}

export interface initialDetailSegments {
  technicalStop: string;
  codeShare: string;
  flightNumber: string;
  originCity: string;
  originIata: string;
  destinationIata: string;
  destinationCity: string;
  departureDate: string;
  departureEnglishDate: string;
  departureTime: string;
  durationHours: string;
  durationMinutes: string;
  destinationStopDurationHour: string;
  destinationStopDurationMinutes: string;
  arrivalDate: string;
  arrivalEnglishDate: string;
  arrivalTime: string;
  logo: string;
  isCharter: string;
  cabinType: string;
  fareClass: string;
  terminal: string;
  airplaneCode: string;
  airplane: string;
  airline: string;
  originAirport: string;
  destinationAirport: string;
  operatingAirlineCode: string;
  allowBaggage: {
    passengerType: string;
    quantity: string;
    description: string;
    unit: string;
    weight: string;
    baggageDisplayText: string;
  }[];
}

export const TripMode = {
  TRIP_MODE_ROUND_TRIP: 2,
  TRIP_MODE_UNDEFINED: 0,
  TRIP_MODE_ONEWAY: 1,
};
export const TripModeConvertor = {
  2: 'TRIP_MODE_ROUND_TRIP',
  0: 'TRIP_MODE_UNDEFINED',
  1: 'TRIP_MODE_ONEWAY',
};
