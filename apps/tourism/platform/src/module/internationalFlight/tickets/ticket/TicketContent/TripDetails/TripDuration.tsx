import styles from './TripDuration.module.scss';
import { LongArrowLeftIcon } from 'assets/icons';
import cn from 'classnames';
import React, { useRef } from 'react';
import Popover from '../Popover';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface TripDurationProps {
  durationText: string;
  stopCount: number | undefined;
  stopDetail: string | undefined;
}

const TripDuration = ({ durationText, stopDetail, stopCount }: TripDurationProps) => {
  const { isMobile } = useDeviceDetect();
  const durationRef = useRef<HTMLSpanElement | null>(null);

  return (
    <div
      className={cn(styles.root, 'd-flex flex-column justify-content-center align-items-center')}
    >
      <span className={styles.duration} ref={durationRef}>
        {durationText}
      </span>
      {!isMobile && (
        <Popover
          className={styles.popover}
          anchorEl={durationRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
            offset: { top: 8 },
          }}
        >
          مدت زمان کل سفر
        </Popover>
      )}
      <LongArrowLeftIcon className={styles.arrow} />
      <div className={'d-flex justify-content-center text-truncate w-100'}>
        {Boolean(stopCount) && (
          <span className={cn(styles['stop-count'], 'ms-1 text-nowrap')}>{stopCount} توقف</span>
        )}
        <span className={cn(styles['stop-detail'], 'text-truncate')}>{stopDetail}</span>
      </div>
    </div>
  );
};

export default TripDuration;
