import { RootState } from 'store';

export const selectFlightRequestId = (state: RootState) =>
  state.internationalFlight.flight.requestId;
