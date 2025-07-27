import { useState, useEffect } from 'react';
import { TCalendarSystem } from 'containers/datepicker/datepicker/types';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'store/hook/storeHook';
import { searchCalendarSystemChanged } from 'store/slices/app/app';

const useLastSearchCalendarSystem = (lastSearchKey: string) => {
  const { query } = useRouter();
  const dispatch = useAppDispatch();

  const [calendarSystem, setCalendarSystem] = useState<TCalendarSystem>('JALALI');

  useEffect(() => {
    const localStorageLastSearch = localStorage.getItem(lastSearchKey);
    const lastSearch = localStorageLastSearch && JSON.parse(localStorageLastSearch)[0];
    lastSearch && setCalendarSystem(lastSearch.calendarSystem || 'JALALI');
  }, [query]);

  const handleCalendarSystemChange = (calendarSystem: 'jalali' | 'gregorian') => {
    const system = calendarSystem === 'jalali' ? 'JALALI' : 'GREGORIAN';
    setCalendarSystem(system);
    dispatch(searchCalendarSystemChanged(calendarSystem));
  };

  return {
    calendarSystem,
    handleCalendarSystemChange,
  };
};

export { useLastSearchCalendarSystem };
