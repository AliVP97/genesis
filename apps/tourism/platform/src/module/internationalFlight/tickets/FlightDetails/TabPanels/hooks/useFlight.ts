import { Itinerary, Flight } from 'module/internationalFlight/tickets/types/api';
import { useAppSelector } from 'store/hook/storeHook';
import {
  selectFlightDetailsItinerary,
  selectFlightDetailDictionary,
  selectFlightDetailsTripDirection,
} from 'store/slices/internationalFlight/selectors/flightDetails';
import { TRIP_DIRECTIONS } from '../../constants/common';
import { useMemo } from 'react';

const getFlight = (tripDirection: number, itinerary: Itinerary | null): Flight | undefined =>
  tripDirection === TRIP_DIRECTIONS.LEAVING ? itinerary?.leavingFlight : itinerary?.returningFlight;

const useFlight = () => {
  const itinerary = useAppSelector(selectFlightDetailsItinerary);
  const dictionary = useAppSelector(selectFlightDetailDictionary);
  const tripDirection = useAppSelector(selectFlightDetailsTripDirection);
  const flight = useMemo(() => getFlight(tripDirection, itinerary), [itinerary, tripDirection]);

  return {
    flight,
    dictionary,
  };
};

export default useFlight;
