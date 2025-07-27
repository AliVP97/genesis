import { useRef } from 'react';

import cn from 'classnames';

import { TDaysContents } from 'containers/datepicker/datepicker/types';
import { useResponsive } from 'utils/hooks/useResponsive';
import DateItem from './DateItem';
import useDragging from './hooks/useDragging';
import useDates from './hooks/useDates';
import Navigator from './Navigator';
import useFocusOnCenter from './hooks/useFocusOnCenter';
import useDateChangeHandler from './hooks/useDateChangeHandler';

import styles from './availableDate.module.scss';

interface IAvailableDates {
  disable: boolean;
  returning?: boolean;
  hidden?: boolean;
  daysContents?: TDaysContents;
  startDate?: string | string[];
}

const AvailableDates = ({
  disable = false,
  returning = false,
  daysContents,
  startDate,
  hidden = false,
}: IAvailableDates) => {
  const { isMobile } = useResponsive();
  const resultDateWrapperRef = useRef<HTMLDivElement>(null); // Ref for the resultDateWrapper div
  const wrapper = resultDateWrapperRef.current;

  const { activeDate, setActiveDate, dates } = useDates(returning, daysContents, startDate);

  //this useEffect is just to handle the selected date comes in the center of calendar module
  useFocusOnCenter(wrapper, dates, returning, activeDate);

  // enable to dragging and move calendar to the sides
  useDragging(resultDateWrapperRef.current);

  const { onDateChange } = useDateChangeHandler(disable, returning, setActiveDate);

  return (
    <div
      className={cn(
        isMobile ? styles.resultDate_mobile : styles.resultDate,
        hidden && styles.hidden,
      )}
    >
      {!isMobile && <Navigator direction={'start'} container={wrapper} />}
      <div
        id="resultDateWrapper"
        ref={resultDateWrapperRef} // Attach ref to the div
        className={isMobile ? styles['resultDate_mobile-wrapper'] : styles.resultDate_wrapper}
      >
        {dates.map((date, index) => (
          <DateItem
            device={{ isMobile }}
            date={date}
            key={index.toString() + date}
            activeDate={activeDate}
            onClick={onDateChange(date)}
          />
        ))}
      </div>
      {!isMobile && <Navigator direction={'end'} container={wrapper} />}
    </div>
  );
};

export default AvailableDates;
