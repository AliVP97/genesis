import cn from 'classnames';
import styles from '../../../../../travels.module.scss';
import { HotelBed } from 'assets/icons';
import React from 'react';
interface IHotelTicketHeaderProps {
  title: string;
  rooms?: number;
  children?: React.ReactNode;
}
const HotelTicketHeader = ({ title, rooms, children }: IHotelTicketHeaderProps) => {
  return (
    <>
      <div className={cn(styles['Details__item'], 'd-flex flex-column bg-color-white mb-3')}>
        <div
          className={cn(
            styles['Details__item__header'],
            'bg-color-blue-grey px-3 py-2 text-weight-500 d-flex justify-content-between',
          )}
        >
          <span className="px-2">
            <HotelBed /> {title}
          </span>
          <span>{rooms} اتاق</span>
        </div>
        {children}
      </div>
    </>
  );
};

export default HotelTicketHeader;
