import { DesktopOriginDestinationLocationType } from 'components/originDestination/interface';

export type TRecentSearchCardData<D = unknown> = {
  index: number;
  calendarSystem?: 'JALALI' | 'GREGORIAN' | string;
  origin?: Partial<DesktopOriginDestinationLocationType<D>>;
  destination?: Partial<DesktopOriginDestinationLocationType<D>>;
  departureDate?: number;
  returnDate?: number;
};

export type TRecentSearchCardsData = TRecentSearchCardData[];

export type TRecentSearchCard = {
  data: TRecentSearchCardData;
  onClick: (e: TRecentSearchCardData) => void;
};
