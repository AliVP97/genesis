import { AirplaneTicket, BusIcon, TrainTicket } from 'assets/icons';
import styles from '../../../travels.module.scss';
import cn from 'classnames';

import React from 'react';
import { TTrip } from 'services/trips/types';

type TicketDetailsItemProps = {
  details: TTrip;
  children?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode;
  title: string;
  passengersCount?: number;
};

const TicketDetailsItem = ({
  details,
  children,
  title,
  passengersCount,
}: TicketDetailsItemProps) => {
  const icon = {
    Flight: <AirplaneTicket />,
    Train: <TrainTicket />,
    Bus: <BusIcon />,
    International_Flight: <AirplaneTicket />,
    Hotel: <></>,
    Undefined: <></>,
    Tour: <></>,
  };
  return (
    <>
      <div className={cn(styles['Details__item'], 'd-flex flex-column bg-color-white mb-3')}>
        <div
          className={cn(
            styles['Details__item__header'],
            'bg-color-blue-light-4 text-3 px-3 py-2 text-weight-500 d-flex',
          )}
        >
          <div className="col-6">
            {details.type && icon[details?.type]}
            <span className="px-2 text-4 ">{title}</span>
          </div>
          <div className="col-6 align-self-end text-start">
            {details?.type !== 'Tour' ? `${passengersCount} مسافر` : ''}
          </div>
        </div>

        {children}
      </div>
    </>
  );
};

export default TicketDetailsItem;
