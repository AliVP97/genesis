import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import jmoment from 'moment-jalaali';

import { DateState } from 'containers/datepicker/selectDate';
import { TrainType } from 'module/train/tickets/interface';
import { CompartmentGenderType } from 'services/train/orders/interface';
import { useStations } from 'services/train/stations';
import { detectDevice } from 'utils/helpers/global';
import { ITrainSearchHistory } from 'utils/helpers/localstorageHelper';
import { TInitialState } from '..';
import { useLocationHistory } from './useLocationHistory';
import { useSearchComponentProps } from './useSearchComponentProps';

const initialState: TInitialState = {
  origin: { code: '', farsiName: '', englishName: '' },
  destination: { code: '', farsiName: '', englishName: '' },
};

export const useSearchBox = () => {
  const [location, setLocation] = useState<TInitialState>(initialState);
  const [activeInput, setActiveInput] = useState<'datepicker' | 'passenger' | null>(null);

  const [date, setDate] = useState<DateState>({
    to: null,
    from: null,
  });

  const [coupeType, setCoupeType] = useState<CompartmentGenderType>('COMPARTMENT_GENDER_FAMILY');
  const [trainType, setTrainType] = useState<TrainType>('oneWay');

  const [wantCompartment, setWantCompartment] = useState(false);

  const [showPassenger, setShowPassenger] = useState(false);

  const { query } = useRouter();

  const { locationHistory, onClear: onClearLocationHistory } = useLocationHistory();

  const nextInput = (input: 'datepicker' | 'passenger' | null) => {
    setActiveInput(input);
  };

  const originURL = (query.id as string)?.split('-')[0];
  const { data: originData } = useStations(originURL, { enabled: !!originURL });

  const destinationURL = (query.id as string)?.split('-')[1];
  const { data: destinationData } = useStations(destinationURL, {
    enabled: !!destinationURL,
  });

  const submitLocation = (value: TInitialState) => {
    setLocation((prev) => ({ ...prev, ...value }));
    if (value.origin.code && value.destination.code && activeInput !== 'passenger') {
      if (
        (trainType === 'oneWay' && !date.from) ||
        (trainType === 'roundTrip' && !date.from && !date.to)
      ) {
        nextInput('datepicker');
      }
    }
  };

  const updateLocationFromQuery = () => {
    const origin = originData?.stations?.[0];
    const destination = destinationData?.stations?.[0];

    if (origin) {
      if (destination) {
        setLocation({
          origin: {
            code: origin?.code || '',
            farsiName: origin?.farsiName || '',
            englishName: origin?.englishName || '',
          },
          destination: {
            code: destination?.code || '',
            farsiName: destination?.farsiName || '',
            englishName: destination?.englishName || '',
          },
        });
      } else {
        setLocation({
          origin: {
            code: '',
            farsiName: '',
            englishName: '',
          },
          destination: {
            code: origin?.code || '',
            farsiName: origin?.farsiName || '',
            englishName: origin?.englishName || '',
          },
        });
      }
    }
  };

  const fillSearchBoxFromQuery = () => {
    const { departureDate, returningDate, wantCompartment: wantCompartmentQuery, gender } = query;

    updateLocationFromQuery();

    if (departureDate) {
      setDate({
        from: Number(jmoment(departureDate, 'jYYYY-jMM-jDD')),
        to: returningDate ? Number(jmoment(returningDate, 'jYYYY-jMM-jDD')) : NaN,
      });
      setWantCompartment(wantCompartmentQuery === 'true');
      if (gender) {
        setCoupeType(gender as CompartmentGenderType);
      }
      setTrainType(returningDate ? 'roundTrip' : 'oneWay');
    }
  };

  const fillSearchBoxFromLastSearch = () => {
    const lastSearch: ITrainSearchHistory[] | [] = JSON.parse(
      localStorage.getItem('train_last_search') as string,
    );

    if (lastSearch?.length) {
      const departureDate = Number(jmoment(lastSearch[0].departureDate, 'YYYY-MM-DD'));

      setWantCompartment(lastSearch[0].wantCompartment);
      if (lastSearch[0].genderCompartment) {
        setCoupeType(lastSearch[0].genderCompartment);
      }

      setLocation({
        origin: {
          code: lastSearch[0]?.origin?.code || '',
          farsiName: lastSearch[0]?.origin?.farsiName || '',
          englishName: lastSearch[0]?.origin?.englishName || '',
        },
        destination: {
          code: lastSearch[0]?.destination?.code || '',
          farsiName: lastSearch[0]?.destination?.farsiName || '',
          englishName: lastSearch[0]?.destination?.englishName || '',
        },
      });

      if (lastSearch[0].returningDate) setTrainType('roundTrip');
      else setTrainType('oneWay');

      if (lastSearch[0].returningDate) {
        const returningDate = Number(jmoment(lastSearch[0].returningDate, 'YYYY-MM-DD'));
        if (returningDate >= departureDate) {
          setDate((prevState) => ({
            ...prevState,
            from: departureDate,
            to: returningDate,
          }));
        }
      } else {
        setDate((prevState) => ({
          ...prevState,
          from: departureDate,
          to: null,
        }));
      }
    }
  };

  const fillSearchBox = () => {
    const SHOULD_FILL_SEARCH_BOX_FROM_LAST_SEARCH = detectDevice() === 'desktop';

    if (query.id) {
      fillSearchBoxFromQuery();
    } else if (SHOULD_FILL_SEARCH_BOX_FROM_LAST_SEARCH) {
      fillSearchBoxFromLastSearch();
    }
  };

  const componentProps = useSearchComponentProps({
    location,
    submitLocation,
    locationHistory,
    onClearLocationHistory,
  });

  useEffect(() => {
    fillSearchBox();
  }, [query, originData, destinationData]);

  useEffect(() => {
    if (activeInput === 'passenger') {
      setShowPassenger(true);
    }
  }, [activeInput]);

  return {
    location,
    trainType,
    setTrainType,
    coupeType,
    setCoupeType,
    date,
    setDate,
    wantCompartment,
    setWantCompartment,
    showPassenger,
    setShowPassenger,
    activeInput,
    componentProps,
  };
};
