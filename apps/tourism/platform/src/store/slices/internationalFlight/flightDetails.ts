import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TABS,
  TRIP_DIRECTIONS,
} from 'module/internationalFlight/tickets/FlightDetails/constants/common';
import { Tab, TripDirection } from 'module/internationalFlight/tickets/FlightDetails/types/common';
import { FlightDictionary } from 'module/internationalFlight/tickets/ticket/types/FlightDictionary';
import { Itinerary, ItineraryDetailResponse } from 'module/internationalFlight/tickets/types/api';
import { isRoundTrip } from 'module/internationalFlight/tickets/utils/sortTicketsByTripTime';

type FlightDetailsState = {
  tab: Tab;
  isRoundTrip: boolean;
  itineraryIndex: number;
  hasSubmitButton: boolean;
  itinerary: Itinerary | null;
  tripDirection: TripDirection;
  dictionary: FlightDictionary;
  isPriceBottomSheetOpen: boolean;
};

const initialState: FlightDetailsState = {
  dictionary: {},
  itinerary: null,
  itineraryIndex: 0,
  isRoundTrip: false,
  hasSubmitButton: true,
  tab: TABS.FLIGHT_DETAILS,
  isPriceBottomSheetOpen: false,
  tripDirection: TRIP_DIRECTIONS.LEAVING,
};

const flightDetailsSlice = createSlice({
  name: 'flightDetails',
  initialState,
  reducers: {
    flightDetailsTabChanged: (state, action: PayloadAction<Tab>) => {
      state.tab = action.payload;
    },
    flightDetailsDataChanged: (state, action: PayloadAction<ItineraryDetailResponse | null>) => {
      if (!action.payload) {
        state.itinerary = null;
        return;
      }

      const { itinerary, aircraftDictionary, airlineDictionary, iataDictionary } = action.payload;

      state.tab = TABS.FLIGHT_DETAILS;
      state.tripDirection = TRIP_DIRECTIONS.LEAVING;
      state.isRoundTrip = isRoundTrip(itinerary?.tripMode);
      state.itinerary = itinerary ?? null;
      state.dictionary = {
        iata: iataDictionary,
        airline: airlineDictionary,
        airCraft: aircraftDictionary,
      };
    },
    flightDetailsIsPriceBottomSheetOpenChanged: (state, action: PayloadAction<boolean>) => {
      state.isPriceBottomSheetOpen = action.payload;
    },
    flightDetailsTripDirectionChanged: (state, action: PayloadAction<TripDirection>) => {
      state.tripDirection = action.payload;
    },
    flightDetailsHasSubmitButtonChanged: (state, action: PayloadAction<boolean>) => {
      state.hasSubmitButton = action.payload;
    },
    flightDetailsItineraryIndexChanged: (state, action: PayloadAction<number>) => {
      state.itineraryIndex = action.payload;
    },
  },
});

export const {
  flightDetailsTabChanged,
  flightDetailsDataChanged,
  flightDetailsTripDirectionChanged,
  flightDetailsItineraryIndexChanged,
  flightDetailsHasSubmitButtonChanged,
  flightDetailsIsPriceBottomSheetOpenChanged,
} = flightDetailsSlice.actions;

export default flightDetailsSlice.reducer;
