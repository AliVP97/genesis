export type TourFiltersType = {
  availableMonths?: string[];
  priceRange?: string[];
  accommodationType?: string[];
  // stars?: string[];
  durations?: string[];
  transportType?: string[];
  facilities?: string[];
};

export type TransformedDataType = {
  availableMonths?: {
    startFrom: string;
    startTo: string;
  }[];
  priceRange?: {
    min: number;
    max: number;
  };
  accommodationType?: string[];
  stars?: number[];
  durations?: string[];
  transportType?: string[];
  facilities?: string[];
};

export type FilterDataItem = {
  key?: string;
  duration?: string;
  persianName?: string;
  title?: string;
  startFrom?: string;
  startTo?: string;
};

export type KeyNameForFarsiLabel = {
  availableMonths: string;
  accommodationType: string;
  durations: string;
  transportType: string;
  facilities: string;
};
