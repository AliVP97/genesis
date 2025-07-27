import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import {
  refundSelectedItineraryChanged,
  refundNextStep,
  refundResetStep,
} from 'store/slices/internationalFlight/refund';
import { RefundItinerary } from '../types/api';
import useCheckedIndex from './useCheckedIndex';
import { selectRefundItineraries } from 'store/slices/internationalFlight/selectors/refund';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const getText = (itinerary: RefundItinerary, type: 'returning' | 'departure') => {
  const typeText = { departure: 'رفت', returning: 'برگشت' }[type];
  const origin = itinerary.origin?.description ?? '';
  const destination = itinerary.destination?.description ?? '';

  return `سفر ${typeText}: ${origin} - ${destination}`;
};

const useSelectPath = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceDetect();
  const itineraries = useAppSelector(selectRefundItineraries);
  const { checkedIndex, handleCheckedIndexChange } = useCheckedIndex();

  const data = useMemo(() => {
    const [departure, returning] = itineraries;

    return [getText(departure, 'departure'), getText(returning, 'returning')];
  }, [itineraries]);

  const handleSubmit = () => {
    dispatch(refundSelectedItineraryChanged(itineraries[checkedIndex]));
    dispatch(refundNextStep());
  };

  const handleCancel = () => {
    dispatch(refundResetStep());
  };

  return {
    data,
    isMobile,
    handleCancel,
    handleSubmit,
    checkedIndex,
    handleCheckedIndexChange,
  };
};

export default useSelectPath;
