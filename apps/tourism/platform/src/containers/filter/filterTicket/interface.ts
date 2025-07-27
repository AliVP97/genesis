export interface AirlineTypes {
  key: string;
  name: string;
  priceFrom: number;
}

export interface FilterType {
  airlines?: string[];
  toward?: string[];
  backward?: string[];
  price?: { min: number; max: number };
  stops?: string[];
  ticketType?: string[];
  flightClass?: string[];
  availableFlights?: string[];
}

export type FilterTypeKeys = { [key in FilterType as string]: string };

export type FilterObject = Record<string, string | string[] | undefined>;
