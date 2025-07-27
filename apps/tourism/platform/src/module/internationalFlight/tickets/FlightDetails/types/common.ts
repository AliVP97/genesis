import { TAB_LABELS, TABS, TRIP_DIRECTIONS } from '../constants/common';

export type Tab = (typeof TABS)[keyof typeof TABS];

export type TabLabel = (typeof TAB_LABELS)[keyof typeof TAB_LABELS];

export type TripDirection = (typeof TRIP_DIRECTIONS)[keyof typeof TRIP_DIRECTIONS];

export type Iata = {
  iataName: string;
  cityName: string;
  iataCode: string;
};

export type Airline = {
  name: string;
  code: string;
  logo: string;
};
