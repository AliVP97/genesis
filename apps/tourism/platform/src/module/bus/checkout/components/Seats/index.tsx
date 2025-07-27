import { FC } from 'react';

import classNames from 'classnames';

import { SeatLegroomIcon } from 'assets/icons';

import styles from './style.module.scss';

const Seats: FC<{ seats?: number[] }> = ({ seats }) => {
  return (
    <>
      <div className={classNames(styles['mobile'], 'd-md-none')}>
        <div
          className={classNames(
            styles['title'],
            'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
          )}
        >
          <SeatLegroomIcon />
          <span className="me-1">شماره صندلی‌ها</span>
        </div>
        <div className="p-3 text-3 text-weight-500">{seats?.join(' , ')}</div>
      </div>
      <div className={classNames('d-none d-md-flex', styles['desktop'])}>
        <span className={classNames(styles['title'])}>
          <SeatLegroomIcon />
          <span className="color-grey-1 text-weight-500">شماره صندلی‌ها</span>
        </span>
        <span>{seats?.join(' , ')}</span>
      </div>
    </>
  );
};

export default Seats;
