import { useQuery } from 'react-query';

import { getDestinationTour } from './api';

export const useHotDestinations = (tourType: string) => {
  return useQuery(['tour-hot-destinations', tourType], () => getDestinationTour(tourType));
};
