import { useEffect, useState } from 'react';

import { DesktopOriginDestinationHistoryType } from 'components/desktopOriginDestination/types';
import { LocationType } from 'components/originDestination/interface';
import { mapToDesktopOriginDestinationHistory } from 'module/train/tickets/helper';
import { ITrainSearchHistory } from 'utils/helpers/localstorageHelper';

export const useLocationHistory = () => {
  const [locationHistory, setLocationHistory] = useState<DesktopOriginDestinationHistoryType>();

  const onClear = (e: LocationType) => {
    const lastSearch = JSON.parse(localStorage.train_last_search);
    lastSearch.forEach((lastSearchItem: ITrainSearchHistory) => {
      lastSearchItem[e] = undefined;
    });
    localStorage.setItem('train_last_search', JSON.stringify(lastSearch));

    setLocationHistory(
      mapToDesktopOriginDestinationHistory(JSON.parse(localStorage.train_last_search || '[]')),
    );
  };

  useEffect(() => {
    setLocationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.train_last_search || '[]').slice(0, 3),
      ),
    );
  }, []);

  return {
    locationHistory,
    onClear,
  };
};
