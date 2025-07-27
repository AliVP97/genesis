import { RefObject, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { selectSearchCalendarSystem } from 'store/slices/app/selectors/calendars';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import createIntersectionObserver from '../utils/createIntersectionObserver';
import { YearMonth } from 'module/internationalFlight/ticketsSearchBox/types/common';
import { mobileSearchCalendarDateChanged } from 'store/slices/app/app';

/**
 * This hook is used to dispatch the date while calendar is open on mobile
 * devices and each dates are considered whenever the user try to scroll the
 * calendar.
 * @param listRef the list of elements to observe data from them.
 */
const useMobileCalendarDateDispatcher = (listRef: RefObject<(HTMLDivElement | null)[]>) => {
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceDetect();
  const calendarSystem = useAppSelector(selectSearchCalendarSystem);

  useEffect(() => {
    const listElements = listRef.current;

    if (!listElements || !isMobile) {
      return;
    }

    const handleUpdate = (value: YearMonth | null) => {
      dispatch(mobileSearchCalendarDateChanged(value));
    };

    const observer = createIntersectionObserver(listElements, calendarSystem, handleUpdate);

    return () => {
      listElements.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [calendarSystem, dispatch, isMobile, listRef]);
};

export default useMobileCalendarDateDispatcher;
