import { useState } from 'react';

import { useRouter } from 'next/router';
import jmoment from 'moment-jalaali';

import { DateState } from 'containers/datepicker/selectDate';
import { trainSearchQuerySchema, TTrainSearchQuery } from 'module/train/search/utils';
import { CompartmentGenderType } from 'services/train/orders/interface';
import { removeCookie } from 'utils/helpers/coockieHelper';
import { searchTrainValidate } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';
import { TInitialState } from '..';
import { Passengers, TrainType } from '../../../interface';

type TUseHandleSearchProps = {
  location: TInitialState;
  trainType: TrainType;
  date: DateState;
  coupeType: CompartmentGenderType;
  wantCompartment: boolean;
};

export const useHandleSearch = ({
  location,
  trainType,
  date,
  coupeType,
  wantCompartment,
}: TUseHandleSearchProps) => {
  const { push, query } = useRouter();

  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [passengers, setPassengers] = useState<Passengers>({
    adult: Number(query!.adult) || 1,
    child: Number(query!.child) || 0,
    infant: (query!.infant && Number(query!.infant)) || 0,
  });

  const pushSearch = () => {
    const queryObject: TTrainSearchQuery = trainSearchQuerySchema.parse({
      departureDate: jmoment(date.from).format('jYYYY-jMM-jDD'),
      returningDate:
        date.to && trainType === 'roundTrip' ? jmoment(date.to).format('jYYYY-jMM-jDD') : undefined,
      gender: coupeType,
      ...passengers,
      wantCompartment,
      sort: 'lowPrice',
    });

    if (queryObject.returningDate === undefined) {
      delete queryObject.returningDate;
    }

    if (!location.origin.englishName) {
      throw new Error('نام انگلیسی مبدا مشخص نیست');
    }
    if (!location.destination.englishName) {
      throw new Error('نام انگلیسی مقصد مشخص نیست');
    }

    push({
      pathname:
        WEB.TRAIN +
        location.origin.englishName.toLowerCase().split(' ').join('_') +
        '-' +
        location.destination.englishName.toLowerCase().split(' ').join('_'),
      query: queryObject,
    });
  };

  const submitSearch = () => {
    try {
      setSearchButtonClicked(true);
      searchTrainValidate(location, trainType, [date.from, date.to]);
      removeCookie('uuid');
      pushSearch();
    } catch (error) {
      notify({
        config: {
          position: 'bottom-right',
          autoClose: false,
          hideProgressBar: true,
        },
        message: (error as Error).message,
        type: 'warning',
      });
    }
  };

  return {
    submitSearch,
    passengers,
    setPassengers,
    searchButtonClicked,
    setSearchButtonClicked,
  };
};
