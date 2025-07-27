import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { BusTickets } from 'services/bus/tickets/interface';
import { useGetBusTypes } from './useGetBusTypes';
import { useGetCompanies } from './useGetCompanies';
import { useGetStations } from './useGetStations';

export const useInitTicketsFilterState = (ticketsData: BusTickets) => {
  const { stations, stationsDestination } = useGetStations(ticketsData);
  const { busTypes } = useGetBusTypes(ticketsData);
  const { companies } = useGetCompanies(ticketsData);

  const initTicketsFilterState: TicketsFilterStateType = [
    {
      id: 'departureTimeRanges',
      // WARNING - add "type" later:
      // type: 'multiple',
      title: 'زمان حرکت',
      component: {
        name: 'multiSelectButtons',
        state: [
          { title: 'بامداد (0 تا 6)', value: '0-6', isSelected: false },
          { title: 'صبح (6 تا 12)', value: '6-12', isSelected: false },
          { title: 'عصر (12 تا 18)', value: '12-18', isSelected: false },
          { title: 'شب (18 تا 24)', value: '18-24', isSelected: false },
        ],
      },
    },
    {
      id: 'stations',
      title: 'پایانه مبدا',
      component: {
        name: 'multiSelectButtons',
        state: stations,
      },
    },
    {
      id: 'stations-destination',
      title: 'پایانه مقصد',
      component: {
        name: 'multiSelectButtons',
        state: stationsDestination,
      },
    },
    {
      id: 'busTypes',
      title: 'نوع اتوبوس',
      component: {
        name: 'multiSelectButtons',
        state: busTypes,
      },
    },
    {
      id: 'companyNames',
      // WARNING - add "type" later:
      // type: 'multiple',
      title: 'شرکت‌های اتوبوسرانی',
      component: {
        name: 'companiesList',
        state: companies,
        showTotal: false,
        showDropdown: false,
      },
    },
  ];

  return { initTicketsFilterState };
};
