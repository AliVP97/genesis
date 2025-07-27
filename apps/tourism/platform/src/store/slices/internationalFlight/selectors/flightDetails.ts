import { RootState } from '../../..';

export const selectFlightDetailsTab = (state: RootState) =>
  state.internationalFlight.flightDetails.tab;

export const selectFlightDetailsTripDirection = (state: RootState) =>
  state.internationalFlight.flightDetails.tripDirection;

export const selectFlightDetailDictionary = (state: RootState) =>
  state.internationalFlight.flightDetails.dictionary;

export const selectFlightDetailsItinerary = (state: RootState) =>
  state.internationalFlight.flightDetails.itinerary;

export const selectFlightDetailsIsRoundTrip = (state: RootState) =>
  state.internationalFlight.flightDetails.isRoundTrip;

export const selectFlightDetailsIsPriceBottomSheetOpen = (state: RootState) =>
  state.internationalFlight.flightDetails.isPriceBottomSheetOpen;

export const selectFlightDetailsHasSubmitButton = (state: RootState) =>
  state.internationalFlight.flightDetails.hasSubmitButton;

export const selectFlightDetailsItineraryIndex = (state: RootState) =>
  state.internationalFlight.flightDetails.itineraryIndex;
