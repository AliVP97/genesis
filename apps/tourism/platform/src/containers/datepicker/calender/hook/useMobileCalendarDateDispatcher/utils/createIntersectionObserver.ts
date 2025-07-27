import { CalendarSystem } from 'containers/datepicker/types/common';
import calculateYearMonth from './calculateYearMonth';
import { YearMonth } from 'module/internationalFlight/ticketsSearchBox/types/common';

/**
 * This function is used to create the intersection observer to observe the dates in mobile view.
 * @param listElements the list of elements to observe data from them.
 * @param calendarSystem  the calendar system to calculate the year and month `jalai' or `gregorian'
 * @param onUpdate the callback function to be called when the date is changed.
 * @returns the observer object
 */
const createIntersectionObserver = (
  listElements: (HTMLDivElement | null)[],
  calendarSystem: CalendarSystem,
  onUpdate: (value: YearMonth | null) => void,
) => {
  const visibleIndexes = new Set<number>();

  const observer = new IntersectionObserver((entries) => {
    let changed = false;

    entries.forEach((entry) => {
      const index = Number(entry.target.getAttribute('data-index')) || 0;

      if (entry.isIntersecting) {
        if (!visibleIndexes.has(index)) {
          visibleIndexes.add(index);
          changed = true;
        }
      } else {
        if (visibleIndexes.has(index)) {
          visibleIndexes.delete(index);
          changed = true;
        }
      }
    });

    if (changed) {
      const indexes = Array.from(visibleIndexes);

      if (indexes.length) {
        const { year, month, monthOffset } = calculateYearMonth(indexes, calendarSystem);

        onUpdate({ year, month, monthOffset });
      } else {
        onUpdate(null);
      }
    }
  });

  listElements.forEach((element) => {
    if (element) {
      observer.observe(element);
    }
  });

  return observer;
};

export default createIntersectionObserver;
