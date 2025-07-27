import { Location } from 'components/originDestination/interface';

export interface Passengers {
  adult: number;
  child: number;
  infant: number;
}
export interface SearchHistory {
  origin: Location;
  destination: Location;
  passenger: Passengers;
  departureDate: string;
  returningDate: string | undefined;
}
