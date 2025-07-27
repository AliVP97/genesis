import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CABIN_TYPES, TRIP_TYPES } from 'module/internationalFlight/search/constants/common';
import { CabinType, Location, TripType } from 'module/internationalFlight/search/types/common';

const DEFAULT_LOCATION: Location = {
  type: 'airport',
  iataCode: '',
  title: '',
  city: '',
};

type Locations = {
  origin?: Location;
  destination?: Location;
};

export type Dates = {
  departure: string;
  returning?: string;
};

export type SearchState = {
  locations: Locations;
  dates: Dates;
  passengers: Passengers;
  tripType: TripType;
  cabinType: CabinType;
};

export type Passengers = {
  adult: number;
  child: number;
  infant: number;
};

const initialState: SearchState = {
  passengers: {
    adult: 1,
    child: 0,
    infant: 0,
  },
  tripType: TRIP_TYPES.ONE_WAY,
  locations: {
    origin: DEFAULT_LOCATION,
    destination: DEFAULT_LOCATION,
  },
  dates: {
    departure: '',
    returning: undefined,
  },
  cabinType: CABIN_TYPES.ECONOMY,
};

const searchSlice = createSlice({
  name: 'internationalFlightSearch',
  initialState,
  reducers: {
    searchLocationsChanged(state, action: PayloadAction<Locations>) {
      state.locations = action.payload;
    },
    searchTripTypeChanged(state, action: PayloadAction<TripType>) {
      state.tripType = action.payload;
    },
    searchDatesChanged(state, action: PayloadAction<{ departure: string; returning?: string }>) {
      state.dates = action.payload;
    },
    searchPassengersChanged(state, action: PayloadAction<Passengers>) {
      state.passengers = action.payload;
    },
    searchCabinTypeChanged(state, action: PayloadAction<CabinType>) {
      state.cabinType = action.payload;
    },
  },
});

export const {
  searchDatesChanged,
  searchTripTypeChanged,
  searchCabinTypeChanged,
  searchLocationsChanged,
  searchPassengersChanged,
} = searchSlice.actions;

export default searchSlice.reducer;
