import { FC } from 'react';
import DesktopTourPassengerInfo from './components/desktopTourPassengerInfo';
import TourPassengersInfo from './components/tourPassengersInfo';

type TTourPassengers = {
  passengers:
    | {
        firstName?: string;
        lastName?: string;
        nationalCode?: string;
        passportNumber?: string;
        passportExpireDate?: string;
      }
    | undefined;
};

const TourPassenger: FC<TTourPassengers> = ({ passengers }) => {
  const passengersInfo = {
    fullName: `${passengers?.firstName} ${passengers?.lastName}`,
    passengerType: 'بزرگسال',
    nationalcode: passengers?.nationalCode,
    passportNum: passengers?.passportNumber,
    passportExp: passengers?.passportExpireDate,
    passportIssuer: 'ایران',
    quantity: '1',
  };
  return (
    <>
      <div className="d-md-none">
        <TourPassengersInfo passengersInfo={passengersInfo} />
      </div>
      <div className="d-none d-md-block">
        <DesktopTourPassengerInfo passengersInfo={passengersInfo} />
      </div>
    </>
  );
};

export default TourPassenger;
