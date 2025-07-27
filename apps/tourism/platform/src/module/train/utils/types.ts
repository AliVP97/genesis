import { CompartmentGenderType } from 'services/train/orders/interface';
import { TTrainStation } from 'services/train/stations/interface';

export type TLocation = {
  origin: TTrainStation;
  destination: TTrainStation;
};

export type TSearchObject = TLocation & {
  departureDate: string;
  returningDate?: string;
  adult: number;
  child: number;
  infant: number;
  wantCompartment: boolean;
  compartmentGenderType: CompartmentGenderType;
};
