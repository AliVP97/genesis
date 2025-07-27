import { useEffect, useState } from 'react';

import { TLocationHistory, TSearchBoxStation, TSearchObject } from '../types';
import { stationTostate } from '../utils';

export const useSearchHistory = () => {
  const [locationHistory, setLocationHistory] = useState<TLocationHistory>({
    origin: [],
    destination: [],
  });

  const onClearLocationHistory = () => {
    localStorage.removeItem('bus_last_search');

    setLocationHistory({ origin: [], destination: [] });
  };

  useEffect(() => {
    const local: TSearchObject[] = JSON.parse(
      localStorage.getItem('bus_last_search') || '[]',
    ).slice(0, 3);

    const originHistory = {} as Record<string, TSearchBoxStation>;
    const destinationHistory = {} as Record<string, TSearchBoxStation>;

    local.forEach(({ origin, destination }) => {
      if (origin.seoCode) {
        originHistory[origin.seoCode] = stationTostate(origin);
      }
      if (destination.seoCode) {
        destinationHistory[destination.seoCode] = stationTostate(destination);
      }
    });

    const history: TLocationHistory = {
      origin: Object.entries(originHistory).map(([, value]) => value),
      destination: Object.entries(destinationHistory).map(([, value]) => value),
    };

    setLocationHistory(history);
  }, []);

  return { locationHistory, setLocationHistory, onClearLocationHistory };
};
