import { useEffect, useState } from 'react';
import useIataCodes from './useParamsId';
import useSearchLocation from './useSearchLocation';
import { useAppDispatch } from 'store/hook/storeHook';
import { searchLocationsChanged } from 'store/slices/internationalFlight/search';

const useSyncSearchParams = () => {
  const { originIata, originType, destinationType, destinationIata } = useIataCodes();
  const { data } = useSearchLocation([
    { iataCode: originIata, iataType: originType },
    { iataCode: destinationIata, iataType: destinationType },
  ]);
  const [status, setStatus] = useState('idle');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const [origin, destination] = data;

      if (origin && destination) {
        setStatus('success');
        dispatch(searchLocationsChanged({ origin, destination }));
      }
    }
  }, [data, dispatch]);

  return status;
};

export default useSyncSearchParams;
