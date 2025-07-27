import { useAppSelector } from 'store/hook/storeHook';
import { selectFlightDetailsItinerary } from 'store/slices/internationalFlight/selectors/flightDetails';
import { VisaPolicy } from '../types/common';
import { useMemo } from 'react';

type VisaPolicyTabPanel = {
  visaPolicies: VisaPolicy[];
};

const useVisaPolicyTabPanel = (): VisaPolicyTabPanel => {
  const itinerary = useAppSelector(selectFlightDetailsItinerary);
  const visaPolicies: VisaPolicy[] = useMemo(
    () =>
      itinerary?.visaPolicies?.map<VisaPolicy>((visaPolicy) => ({
        title: visaPolicy.title ?? '',
        descriptions: visaPolicy.descriptions ?? [],
      })) || [],
    [itinerary],
  );

  return {
    visaPolicies,
  };
};

export default useVisaPolicyTabPanel;
