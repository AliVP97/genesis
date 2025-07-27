import { Location as L } from 'components/originDestination/interface';

export interface ChildPassenger {
  value: string;
}

export interface HotelPassengers {
  adult: number;
  child: Array<ChildPassenger>;
}

export interface SearchHistory {
  origin: L;
  destination: L;
  passenger: Array<HotelPassengers>;
  departureDate: string;
  returningDate: string | undefined;
}
export type TQueryObject = {
  requestId: string;
  checkInDate: string;
  checkOutDate: string | undefined;
  rooms: string;
  destinationType: string;
  sort: string;
  cityId: string | undefined;
  cityName: string | undefined;
  readCache?: string;
  cityEng?: string;
};

export type Location = {
  value: string;
  city: string;
  cityEng: string;
  airport: string;
  hotelName?: string;
  type?: {
    id: string;
    title: string;
  };
  data?: { [key: string]: string };
  clicked?: boolean;
};
