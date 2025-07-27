import { useMemo } from 'react';
import getSegment from '../utils/getSegment';
import { Segment } from '../types/common';
import useFlight from '../../hooks/useFlight';

type UseFlightDetailsTabPanel = {
  segments: Segment[];
};

const useFlightDetailsTabPanel = (): UseFlightDetailsTabPanel => {
  const { dictionary, flight } = useFlight();

  const segments = useMemo(
    () => flight?.segments?.map(getSegment(dictionary, flight)) ?? [],
    [dictionary, flight],
  );

  return {
    segments,
  };
};

export default useFlightDetailsTabPanel;
