import { useQuery } from 'react-query';
import { getLocations } from './api';

export const useLocationSearch = (tourType: string, locationType: string, cityName: string) => {
  return useQuery(
    ['tour-search', tourType, locationType, cityName],
    () => getLocations(tourType, locationType, cityName),
    {
      enabled: !!tourType && !!locationType && !!cityName,
    },
  );
};
