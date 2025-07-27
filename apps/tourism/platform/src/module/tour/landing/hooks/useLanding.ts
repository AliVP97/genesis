import { useState } from 'react';

import { notify } from 'utils/notification';
import { useQuery } from 'react-query';
import { getHotTours } from 'services/tour/v2/hotTours/api';
import { getTourSuggestion } from 'services/tour/v2/tourSuggestion/api';
export const useLanding = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { data: tourData, isLoading: isLoadingTour } = useQuery({
    queryKey: ['tour-hot-tours'],
    queryFn: () => getHotTours(),
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: error?.response?.data?.message,
        config: {
          position: 'top-right',
          hideProgressBar: true,
          draggable: true,
        },
      });
    },
  });

  const { data: tourSuggestion } = useQuery({
    queryKey: ['tour-suggestion'],
    queryFn: () => getTourSuggestion(),
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: error.response.data.message,
        config: {
          position: 'top-right',
          hideProgressBar: true,
          draggable: true,
        },
      });
    },
  });

  return {
    tourData,
    isLoadingTour,
    tourSuggestion,
    activeTab,
    setActiveTab,
  };
};
