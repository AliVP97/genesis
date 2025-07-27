import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { THotelList } from 'services/hotel/prepare/interface';
import { useGetFacility } from './useGetFacility';
import { usePriceMinMax } from './usePriceMinMax';

export const useInitTicketsFilterState = (hotelList: THotelList) => {
  const { priceMinMax } = usePriceMinMax(hotelList);
  const { facilities } = useGetFacility(hotelList);

  const initTicketsFilterState: TicketsFilterStateType = [
    {
      id: 'priceRange',
      title: 'قیمت (ریال)',
      component: {
        name: 'rangeControl',
        state: [
          { prefix: 'از', value: priceMinMax.min },
          { prefix: 'تا', value: priceMinMax.max },
        ],
        staticValues: {
          minMax: [priceMinMax.min, priceMinMax.max],
        },
      },
    },
    {
      id: 'type',
      title: 'نوع اقامتگاه',
      component: {
        name: 'multiSelectButtons',
        state: [{ title: 'هتل', value: 'HOTEL', isSelected: false }],
      },
    },
    {
      id: 'stars',
      title: 'ستاره هتل',
      component: {
        name: 'multiSelectButtons',
        state: [
          { title: 'کم تر از ۳ ستاره', value: '0', isSelected: false },
          { title: '۴ ستاره', value: '1', isSelected: false },
          { title: '۵ ستاره', value: '2', isSelected: false },
        ],
      },
    },
    {
      id: 'facilities',
      title: 'امکانات هتل و اتاق ها',
      component: {
        name: 'companiesList',
        state: facilities,
        showTotal: false,
        showDropdown: false,
      },
    },
  ];
  return { initTicketsFilterState };
};
