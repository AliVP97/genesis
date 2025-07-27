import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from 'module/flights/search/types/common';

const DEFAULT_LOCATION: Location = {
  airport: '',
  city: '',
  value: '',
};

type Locations = {
  origin?: Location;
  destination: Location;
};

export type Dates = {
  departure: string;
  returning?: string;
};

type SearchState = {
  locations: Locations;
  dates: Dates;
  passengers: Passengers;
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
  locations: {
    origin: DEFAULT_LOCATION,
    destination: DEFAULT_LOCATION,
  },
  dates: {
    departure: '',
    returning: undefined,
  },
};

const searchSlice = createSlice({
  name: 'flightSearch',
  initialState,
  reducers: {
    searchLocationsChanged(state, action: PayloadAction<Locations>) {
      state.locations = action.payload;
    },
    searchDatesChanged(state, action: PayloadAction<{ departure: string; returning?: string }>) {
      state.dates = action.payload;
    },
    searchPassengersChanged(state, action: PayloadAction<Passengers>) {
      state.passengers = action.payload;
    },
  },
});

export const { searchDatesChanged, searchLocationsChanged, searchPassengersChanged } =
  searchSlice.actions;

export default searchSlice.reducer;
