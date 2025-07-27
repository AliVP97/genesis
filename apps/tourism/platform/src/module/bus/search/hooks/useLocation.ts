import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useAppDispatch } from 'store/hook/storeHook';
import { notFoundRedirectUrlChanged } from 'store/slices/app/app';
import URLS from 'utils/routes/web';
import { TLocation, TQueryObject } from '../types';
import { queryToLocation } from '../utils';

type TUseLocationProps = {
  onSubmit?: (value: TLocation) => void;
};

export const initialState: TLocation = {
  origin: {
    stationCode: '',
    stationName: '',
    cityName: '',
    provinceName: '',
    seoCode: '',
  },
  destination: {
    stationCode: '',
    stationName: '',
    cityName: '',
    provinceName: '',
    seoCode: '',
  },
};

export const useLocation = ({ onSubmit }: TUseLocationProps) => {
  const { query, replace } = useRouter();
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState<TLocation>(initialState);

  const submitLocation = (value: TLocation) => {
    setLocation((prev) => ({ ...prev, ...value }));

    onSubmit?.(value);
  };

  const getLocationFromQuery = async () => {
    try {
      const { origin, destination } = await queryToLocation(query as TQueryObject);

      setLocation({ origin, destination });
    } catch (error) {
      dispatch(notFoundRedirectUrlChanged(URLS.BUS));
      replace('/404');
    }
  };

  useEffect(() => {
    if (query.id) {
      getLocationFromQuery();
    }
  }, [query?.id]);

  return { location, submitLocation };
};
