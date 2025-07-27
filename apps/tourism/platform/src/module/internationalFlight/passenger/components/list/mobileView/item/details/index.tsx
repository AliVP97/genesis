import React from 'react';
import classNames from 'classnames';

type TPassengerItemDetailsProps = {
  title: string;
  value: string;
  className?: string;
};
const PassengerItemDetails = ({ title, value, className }: TPassengerItemDetailsProps) => {
  return (
    <>
      <div className="d-flex justify-content-between w-100 my-2">
        <span className={classNames('color-grey-19', className)} style={{ fontFamily: 'Roboto' }}>
          {value}
        </span>
        <span className="color-grey-19">{title}</span>
      </div>
    </>
  );
};

export default PassengerItemDetails;
