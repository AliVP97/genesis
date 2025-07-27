import { useQuery } from 'react-query';

import { getPromotionSlider } from './api';

export const usePromotionSlider = () => {
  const {
    data: tourSliderData,
    isFetching,
    isLoading,
  } = useQuery(['get-promotion-tour'], getPromotionSlider);
  return { tourSliderData, isFetching, isLoading };
};
