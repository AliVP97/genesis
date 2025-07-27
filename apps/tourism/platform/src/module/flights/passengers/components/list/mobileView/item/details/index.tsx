import React from 'react';

type TPassengerItemDetailsProps = {
  title: string;
  value: string;
};
const PassengerItemDetails = ({ title, value }: TPassengerItemDetailsProps) => {
  return (
    <>
      <div className="d-flex justify-content-between w-100 my-2">
        <span className="color-grey-19 ">{value}</span>
        <span className="color-grey-19">{title}</span>
      </div>
    </>
  );
};

export default PassengerItemDetails;
