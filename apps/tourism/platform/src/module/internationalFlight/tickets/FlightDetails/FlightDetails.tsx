import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { selectFlightDetailsItinerary } from 'store/slices/internationalFlight/selectors/flightDetails';
import useBreakpoint, { DEVICE_SIZES } from './hooks/useBreakpoint';
import DesktopModal from './DesktopModal';
import MobileTabletModal from './MobileTabletModal';
import { useEffect } from 'react';
import {
  flightDetailsDataChanged,
  flightDetailsHasSubmitButtonChanged,
} from 'store/slices/internationalFlight/flightDetails';
import { ItineraryDetailResponse } from '../types/api';
import { flightRequestIdChanged } from 'store/slices/internationalFlight/flight';
import LoaderModal from './Modal/LoaderModal';

type FlightDetailsProps = {
  requestId?: string;
  isLoading: boolean;
  hasSubmitButton: boolean;
  response?: ItineraryDetailResponse;
};

const FlightDetails = ({ response, requestId, isLoading, hasSubmitButton }: FlightDetailsProps) => {
  const dispatch = useAppDispatch();
  const itinerary = useAppSelector(selectFlightDetailsItinerary);
  const isDesktop = useBreakpoint((breakpoint) => breakpoint.up(DEVICE_SIZES.MD));

  useEffect(() => {
    dispatch(flightRequestIdChanged(requestId));
    dispatch(flightDetailsDataChanged(response ?? null));
    dispatch(flightDetailsHasSubmitButtonChanged(hasSubmitButton));
  }, [dispatch, hasSubmitButton, requestId, response]);

  if (!isDesktop && isLoading) {
    return <LoaderModal />;
  }

  if (!itinerary) {
    return null;
  }

  return (
    <>
      {isDesktop && <DesktopModal />}
      {!isDesktop && <MobileTabletModal />}
    </>
  );
};

export default FlightDetails;
