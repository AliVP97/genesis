import { LuggageIcon, NoLuggageIcon } from 'assets/icons';
import styles from './TripOverview.module.scss';
import cn from 'classnames';
import { Iata } from '../../types/common';
import { DurationData } from 'module/internationalFlight/tickets/utils/formatDuration';
import TripOverviewOverviewDuration from './TripOverviewDuration';

export type TripOverviewProps = {
  nextDay: boolean;
  originTime: string;
  originIata: Iata;
  flightNumber: string;
  aircraftCode: string;
  destinationIata: Iata;
  destinationTime: string;
  duration: DurationData;
  baggageDescription?: string;
};

const TripOverview = ({
  nextDay,
  originIata,
  originTime,
  duration,
  flightNumber,
  aircraftCode,
  destinationIata,
  destinationTime,
  baggageDescription,
}: TripOverviewProps) => (
  <>
    <div className="d-flex flex-row justify-content-between align-items-center mxy-2">
      <div className={styles['point-container']}>
        <div className={styles.time}>{originTime}</div>
      </div>
      <TripOverviewOverviewDuration duration={duration} />
      <div
        className={cn(
          'd-flex flex-row align-items-center justify-content-end',
          styles['point-container'],
        )}
      >
        {nextDay && <div className={cn(styles['next-day'], 'fw-400')}>روز بعد</div>}
        <div className={cn(styles.time, 'me-1')}>{destinationTime}</div>
      </div>
    </div>
    <div className="d-flex justify-content-around">
      <div className="d-flex w-50 ps-1">
        <span className={cn(styles['iata'], styles['origin-iata-code'])}>
          {originIata.iataCode}
        </span>
        <div className={cn(styles['iata'], 'text-truncate', styles['iata-name'])}>
          ({originIata.iataName})
        </div>
      </div>
      <div className="d-flex w-50 justify-content-end pe-1">
        <div className={cn(styles['iata'], styles['iata-name'], 'text-truncate text-start')}>
          ({destinationIata.iataName})
        </div>
        <span className={cn(styles['iata'], styles['destination-iata-code'])}>
          {destinationIata.iataCode}
        </span>
      </div>
    </div>
    <div className="row">
      <span className={cn(styles['flight-number'], 'col-4')}>شماره پرواز: {flightNumber}</span>
      <span className={cn(styles['flight-headline'], 'col-4 text-center')}>{aircraftCode}</span>
      <div
        dir="ltr"
        className={cn('col-4 text-start d-flex align-items-center', styles['baggage-description'])}
      >
        {baggageDescription && (
          <>
            <LuggageIcon className={styles['luggage-icon']} />
            <span className={styles['__value']} dir={'auto'}>
              {baggageDescription}
            </span>
          </>
        )}
        {!baggageDescription && (
          <>
            <NoLuggageIcon className={styles['no-luggage-icon']} />
            <span className={styles['no-value']}>بدون بار</span>
          </>
        )}
      </div>
    </div>
  </>
);

export default TripOverview;
