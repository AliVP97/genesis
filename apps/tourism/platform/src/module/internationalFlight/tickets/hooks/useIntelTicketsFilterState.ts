import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { usePriceMinMax } from 'module/internationalFlight/tickets/hooks/usePriceMinMax';
import { useGetAirlines } from 'module/internationalFlight/tickets/hooks/useGetAirlines';
import { useDurationMinMax } from './useDurationMinMax';
import { useTicketType } from './useTicketType';
import { AvailabilityListResponseV2, ItineraryV2 } from '../types/api';

export const useInitTicketsFilterState = (ticketsData: AvailabilityListResponseV2) => {
  const { priceMinMax } = usePriceMinMax(ticketsData);
  const { airlines } = useGetAirlines(ticketsData);
  const { durationMinMax } = useDurationMinMax(ticketsData);
  const { isCharter } = useTicketType(ticketsData?.itineraries as ItineraryV2[]);
  const isReturning = durationMinMax.length === 2;

  const primaryInitTicketsFilterState: TicketsFilterStateType = [
    {
      id: 'priceRange',
      title: 'قیمت (ریال)',
      component: {
        name: 'rangeControl',
        state: [
          { suffix: 'ریال', value: priceMinMax.min },
          { suffix: 'ریال', value: priceMinMax.max },
        ],
        staticValues: {
          minMax: [priceMinMax.min, priceMinMax.max],
        },
      },
    },
    {
      id: 'departureDuration',
      title: `${isReturning ? 'مدت سفر رفت' : 'مدت سفر'}`,
      component: {
        name: 'rangeControl',
        state: [
          { prefix: 'از', value: durationMinMax[0]?.min, suffix: 'ساعت' },
          { prefix: 'تا', value: durationMinMax[0]?.max, suffix: 'ساعت' },
        ],
        staticValues: {
          minMax: [durationMinMax[0]?.min, durationMinMax[0]?.max],
        },
      },
    },
    {
      id: 'returningDuration',
      title: 'مدت سفر برگشت',
      component: {
        name: 'rangeControl',
        state: [
          { prefix: 'از', value: durationMinMax[1]?.min, suffix: 'ساعت' },
          { prefix: 'تا', value: durationMinMax[1]?.max, suffix: 'ساعت' },
        ],
        staticValues: {
          minMax: [durationMinMax[1]?.min, durationMinMax[1]?.max],
        },
      },
    },
    {
      id: 'ticketType',
      title: 'نوع بلیط',
      component: {
        name: 'multiSelectButtons',
        state: [
          { title: 'چارتری', value: 'true', isSelected: false },
          { title: 'سیستمی', value: 'false', isSelected: false },
        ],
      },
    },
    {
      id: 'departureTime',
      title: `${isReturning ? 'ساعت حرکت رفت' : 'ساعت پرواز'}`,
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
      id: 'returningTime',
      title: 'ساعت حرکت برگشت',
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
      id: 'departureStops',
      title: `${isReturning ? 'تعداد توقف رفت' : 'تعداد توقف'}`,
      component: {
        name: 'multiSelectButtons',
        state: [
          { title: 'بدون توقف', value: '0', isSelected: false },
          { title: '۱ توقف', value: '1', isSelected: false },
          { title: '۲ توقف و بیشتر', value: '2', isSelected: false },
        ],
      },
    },
    {
      id: 'returningStops',
      title: 'تعداد توقف برگشت',
      component: {
        name: 'multiSelectButtons',
        state: [
          { title: 'بدون توقف', value: '0', isSelected: false },
          { title: '۱ توقف', value: '1', isSelected: false },
          { title: '۲ توقف و بیشتر', value: '2', isSelected: false },
        ],
      },
    },
    {
      id: 'airlines',
      title: 'شرکت‌های هواپیمایی',
      component: {
        name: 'companiesList',
        state: airlines,
      },
    },
  ];

  const charterFiltered = primaryInitTicketsFilterState.filter((item) =>
    isCharter ? item : !item.id.includes('ticketType'),
  );
  const initTicketsFilterState = charterFiltered.filter((item) =>
    isReturning ? item : !item?.id?.includes('returning'),
  );
  return { initTicketsFilterState };
};
