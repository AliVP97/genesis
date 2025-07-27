import { DurationData } from 'module/internationalFlight/tickets/utils/formatDuration';
import styles from './TripOverviewDuration.module.scss';

type TripOverviewDurationProps = {
  duration: DurationData;
};

const TripOverviewOverviewDuration = ({ duration }: TripOverviewDurationProps) => (
  <div className={styles['duration-container']}>
    <div className={styles['arrow-tail']}></div>
    <div className={styles.duration}>
      <span>
        {duration.hours && <span>{duration.hours}</span>}
        {Boolean(duration.hours && duration.minutes) && <span> و </span>}
      </span>
      {duration.minutes && <span>{duration.minutes}</span>}
    </div>
    <div className={styles['arrow-tail']}></div>
    <div className={styles['arrow-head']}></div>
  </div>
);

export default TripOverviewOverviewDuration;
