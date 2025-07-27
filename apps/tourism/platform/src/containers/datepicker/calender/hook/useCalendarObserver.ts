import { useEffect } from 'react';
import { useAppDispatch } from 'store/hook/storeHook';
import { mobileCalendarObservedDateChanged } from 'store/slices/app/app';

function useCalendarObserver(
  listRef: React.RefObject<(HTMLDivElement | null)[]>,
  todayDate: React.MutableRefObject<{ month: number; year: number }>,
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let month = todayDate.current.month;
            let year = todayDate.current.year;
            const index = entry.target.getAttribute('data-index') || 0;
            month += +index;

            if (month >= 12) {
              year += Math.floor(month / 12);
              month -= 12;
            }

            dispatch(mobileCalendarObservedDateChanged({ month, year }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 },
    );

    listRef.current?.forEach((el) => el && observer.observe(el));

    return () => {
      listRef.current?.forEach((el) => el && observer.unobserve(el));
    };
  }, [dispatch, listRef, todayDate]);
}

export default useCalendarObserver;
