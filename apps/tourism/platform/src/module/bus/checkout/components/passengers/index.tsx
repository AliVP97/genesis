import { FC } from 'react';
import cn from 'classnames';

import LeaderInfo from './leaderInfo';

import { TBusOrderPassengers } from 'services/bus/order/interface';
import { UserIcon } from 'assets/icons';

import styles from '../../styles/invoice.module.scss';

type TPassengersProps = {
  passengers: TBusOrderPassengers;
  isInternational?: boolean;
};

const Passengers: FC<TPassengersProps> = ({ passengers, isInternational }) => {
  return (
    <>
      <div className="d-md-none">
        <div className={cn(styles['invoice__table'], 'mx-auto rtl')}>
          <div
            className={cn(
              styles['invoice__table__header'],
              'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
            )}
          >
            <UserIcon />
            <span>مسافران</span>
          </div>
          <div>
            {passengers?.passengersInfo && (
              <LeaderInfo
                isInternational={isInternational}
                leaderUserId={passengers.leaderUserId || ''}
                passengersInfo={passengers.passengersInfo}
              />
            )}
          </div>
        </div>
      </div>
      <div className="d-none d-md-block rtl">
        <div className={cn(styles['invoice__table'], 'mx-auto rtl')}>
          <div
            className={cn(
              styles['invoice__table__header'],
              'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
            )}
          >
            <UserIcon />
            <span>مسافران</span>
          </div>
          <div className="py-4">
            {passengers?.passengersInfo && (
              <LeaderInfo
                isInternational={isInternational}
                leaderUserId={passengers.leaderUserId || ''}
                passengersInfo={passengers.passengersInfo}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Passengers;
