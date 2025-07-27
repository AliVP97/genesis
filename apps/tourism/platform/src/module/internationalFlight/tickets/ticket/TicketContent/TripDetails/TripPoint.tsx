import TripDirection from './types/TripDirection';
import Iata from '../../types/Iata';
import cn from 'classnames';
import styles from './TripPoint.module.scss';
import React, { useRef } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Popover from '../Popover';

interface TripPointProps {
  direction: TripDirection;
  time?: string;
  iata?: Iata;
  nextDay?: string;
  isRoundTrip: boolean;
  hasDiffIata: boolean;
  isLeavingFlight: boolean;
}

function getDirectionText(
  direction: TripDirection,
  isLeavingFlight: boolean,
  isRoundTrip: boolean,
): string {
  let prefix = '';

  if (isRoundTrip) {
    if (isLeavingFlight) {
      prefix = ' (رفت)';
    } else {
      prefix = ' (برگشت)';
    }
  }

  return direction === 'destination' ? `مقصد` : `${prefix} مبدا`;
}

interface IataDetail {
  iataCode?: string;
  cityName?: string;
  iataName?: string;
}

const getIataDetail = (iata: Iata | undefined): IataDetail => ({
  iataName: iata?.name?.persian,
  cityName: iata?.city?.name?.persian,
  iataCode: iata?.code,
});

function getHighlightIata(
  hasDiffIata: boolean,
  isLeavingFlight: boolean,
  direction: 'origin' | 'destination',
) {
  if (!hasDiffIata) {
    return false;
  }

  if (
    (isLeavingFlight && direction === 'destination') ||
    (!isLeavingFlight && direction === 'origin')
  ) {
    return true;
  }
}

const TripPoint = (props: TripPointProps) => {
  const { isMobile } = useDeviceDetect();
  const { direction, time, iata, hasDiffIata, isLeavingFlight, isRoundTrip, nextDay } = props;
  const { iataCode, iataName, cityName } = getIataDetail(iata);
  const directionText = getDirectionText(direction, isLeavingFlight, isRoundTrip);
  const iataRef = useRef<HTMLDivElement | null>(null);
  const highlightIata = getHighlightIata(hasDiffIata, isLeavingFlight, direction);

  return (
    <div
      className={cn(
        !isMobile && direction === 'destination' && styles.destination,
        direction === 'origin' && styles.root,
        'd-flex flex-column text-md-end',
        direction === 'destination' ? 'text-start' : 'text-end',
      )}
    >
      <span className={cn(styles.direction)}>{directionText}</span>
      <div
        className={cn(
          'd-flex align-items-center',
          direction === 'origin' && 'justify-content-start',
          isMobile && direction === 'destination' && 'justify-content-start flex-row-reverse',
        )}
      >
        <span className={cn(styles.time)}>{time}</span>
        {direction === 'destination' && nextDay && (
          <span className={cn(styles['next-day'], 'me-md-1 ms-1 ms-md-0')}>{nextDay}</span>
        )}
      </div>
      <div
        ref={iataRef}
        className={cn(
          styles.iata,
          'd-flex flex-md-row gap-1 align-items-center',
          isMobile && direction === 'destination' && 'justify-content-start flex-row-reverse w-100',
        )}
      >
        <span className={cn(styles['iata-code'], highlightIata && styles['iata-code_highlight'])}>
          {iataCode}
        </span>
        <span className={styles['city-name']}>({cityName})</span>
      </div>
      {!isMobile && (
        <Popover
          className={styles.popover}
          anchorEl={iataRef.current}
          anchorOrigin={{
            vertical: 'center',
            horizontal: direction === 'destination' ? 'right' : 'left',
            offset: { [direction === 'destination' ? 'right' : 'left']: 8 },
          }}
        >
          {iataName}
        </Popover>
      )}
    </div>
  );
};

export default TripPoint;
