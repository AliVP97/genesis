import { cloneDeep } from 'lodash';

import { CompaniesListStateType } from 'containers/companiesList/types';
import { TrainResponse } from 'services/train/tickets/interface';
import { removeDuplications, RemoveDuplicationsArrayMemberType } from 'utils/helpers/global';
import { TicketsFilterStateType } from 'containers/ticketsFilter/types';

export const calculateFareMinMax = (trainLists: TrainResponse['trainLists']) => {
  if (!trainLists) return { min: 0, max: 0 };
  if (!trainLists[0].trainList) return { min: 0, max: 0 };
  const orderPrice = [...trainLists[0].trainList].sort((a, b) => +a.fare! - +b.fare!);

  return {
    min: Number(orderPrice?.[0]?.fare) || 0,
    max: Number(orderPrice[orderPrice.length - 1]?.fare) || 0,
  };
};

export const getCompanies = (trainLists: TrainResponse['trainLists']): CompaniesListStateType => {
  if (!trainLists || !trainLists[0].trainList) return [];

  return removeDuplications(
    cloneDeep(trainLists[0].trainList).sort((a, b) => {
      return Number(a.fare) - Number(b.fare);
    }) as RemoveDuplicationsArrayMemberType[],
    'companyName',
  ).map((company) => ({
    title: company.companyName,
    value: company.companyName,
    isSelected: false,
    logo: company.logoUrl,
    info: `از ${Number(company.fare).toLocaleString()} ریال`,
  }));
};
export const getInitialFilterState = (trainLists?: TrainResponse['trainLists']) => {
  const fareMinMax = calculateFareMinMax(trainLists);
  const companies = getCompanies(trainLists);

  // dependant to fareMinMax & companies init tickets filter state:
  const initTicketsFilterState: TicketsFilterStateType = [
    {
      id: 'fareRange',
      title: 'قیمت (ریال)',
      component: {
        // WARNING - define as global type:
        name: 'rangeControl',
        state: [
          { prefix: 'از', value: fareMinMax.min },
          { prefix: 'تا', value: fareMinMax.max },
        ],
        staticValues: {
          minMax: [fareMinMax.min, fareMinMax.max],
        },
      },
    },
    {
      id: 'departureTimeRanges',
      // WARNING - add "type" later:
      // type: 'multiple',
      title: 'ساعت حرکت رفت',
      component: {
        name: 'multiSelectButtons',
        state: [
          { title: 'بامداد (00 تا 06)', value: '0-6', isSelected: false },
          { title: 'صبح (06 تا 12)', value: '6-12', isSelected: false },
          { title: 'عصر (12 تا 18)', value: '12-18', isSelected: false },
          { title: 'شب (18 تا 24)', value: '18-24', isSelected: false },
        ],
      },
    },
    {
      id: 'wagonTypes',
      // WARNING - add "type" later:
      // type: 'multiple',
      title: 'نوع واگن ',
      component: {
        name: 'multiSelectButtons',
        state: [
          {
            title: 'سالنی 4 ردیفه',
            value: 'WAGON_TYPE_BUS_4',
            isSelected: false,
          },
          {
            title: 'سالنی 6 ردیفه',
            value: 'WAGON_TYPE_BUS_6',
            isSelected: false,
          },
          {
            title: 'کوپه ای 4 نفره',
            value: 'WAGON_TYPE_COMPARTMENT_4',
            isSelected: false,
          },
          {
            title: 'کوپه ای 6 نفره',
            value: 'WAGON_TYPE_COMPARTMENT_6',
            isSelected: false,
          },
        ],
      },
    },
    {
      id: 'companyNames',
      // WARNING - add "type" later:
      // type: 'multiple',
      title: 'شرکت‌های ریلی',
      component: {
        name: 'companiesList',
        state: companies,
      },
    },
  ];

  return initTicketsFilterState;
};
