import { useEffect, useRef, useState } from 'react';

import { usePassenger } from './hooks';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { checkInputsValidation } from './utils';
import { TType as TTourType } from 'services/tour/v2';
import { TActiveInput, TLocationType } from './types';
import WEB from 'utils/routes/web';
import { useRouter } from 'next/router';
import { scrollHandler } from 'store/slices/domestic-flights/mainPageScrollPlace';
import getServicesTabOffsetTop from 'utils/helpers/servicesTabScrollTopPosition';
import { useDispatch } from 'react-redux';

const initialState = {
  origin: { city: '', value: '' },
  destination: { city: '', value: '' },
};

export const useSearch = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { query } = useRouter();

  const searchBtn = useRef<HTMLButtonElement>(null);

  const [location, setLocation] = useState(initialState);
  const [activeInput, setActiveInput] = useState<TActiveInput>(null);

  const [tourType, setTourType] = useState<TTourType>(
    typeof router.query.type === 'string' ? router.query.type : 'DOMESTIC',
  );
  const { id } = query;

  useEffect(() => {
    if (router.isReady) {
      const type =
        typeof router.query.type === 'string' ? router.query.type.toUpperCase() : 'DOMESTIC';
      if (type === 'INTERNATIONAL' || type === 'DOMESTIC') {
        setTourType(type as TTourType);
      } else {
        setTourType('DOMESTIC');
      }
    }
  }, [router.isReady, router.query.type]);
  useEffect(() => {
    if (!id) {
      setLocation(initialState);
    }
  }, [id]);
  const handleChangeType = (type: TTourType) => {
    localStorage.setItem('tour_type', type);
    setTourType(type);
  };
  const nextInput = (input: 'datepicker' | 'passenger' | null) => {
    setActiveInput(input);
  };

  useEffect(() => {
    if (query.type != tourType) setLocation(initialState);
  }, [tourType]);
  const submitLocation = (value: TLocationType) => {
    setLocation((prev) => ({ ...prev, ...value }));
    if (checkInputsValidation(value?.origin?.value, value?.destination?.value)) {
      nextInput('datepicker');
    }
  };

  const isSuperApp = useIsSuperApp();

  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();

  const { passengers, setPassengers, showPassenger, setShowPassenger } = usePassenger(activeInput);

  const submitSearch = () => {
    router
      .push(
        `${WEB.TOUR}${
          location.origin.value ? location.origin.value + '-' : ''
        }${location.destination.value}` +
          `?adult=${passengers.adult}` +
          `${passengers?.childAges?.length ? `&child=${passengers.childAges}` : ''}` +
          `&type=${tourType}` +
          `&originName=${location.origin.city}` +
          `&destinationName=${location.destination.city}`,
        undefined,
        { shallow: true },
      )
      .then(() => {
        dispatch(scrollHandler({ status: false }));
        setTimeout(() => {
          getServicesTabOffsetTop();
        }, 500);
      });
  };

  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  useEffect(() => {
    if (!showPassenger) {
      setActiveInput(null);
      if (checkInputsValidation(location?.origin?.value, location?.destination?.value)) {
        searchBtn?.current?.focus();
      }
    }
  }, [showPassenger]);

  return {
    isSuperApp,
    tourType,
    handleChangeType,
    submitLocation,
    submitSearch,
    passengers,
    setPassengers,
    showPassenger,
    setShowPassenger,
    searchBtn,
    searchButtonClicked,
    routeChangeStarted,
    location,
  };
};
