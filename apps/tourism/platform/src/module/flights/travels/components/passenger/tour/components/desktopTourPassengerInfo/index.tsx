import { FC } from 'react';
import styles from '../../../../../travels.module.scss';
import cn from 'classnames';

export type TTourPassengersInfo = {
  passengersInfo: {
    fullName: string;
    passengerType: string;
    nationalcode: string | undefined;
    passportNum: string | undefined;
    passportExp: string | undefined;
    passportIssuer: string;
    quantity: string;
  };
};

const DesktopTourPassengerInfo: FC<TTourPassengersInfo> = ({ passengersInfo }) => {
  const date = new Date(Number(passengersInfo.passportExp) * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  const formattedDate = `${year}/${month}/${day}`;
  return (
    <table className="text-center w-100 overflow-hidden rounded-4">
      <thead>
        <tr
          className={cn(
            styles['travels-container__content__items__font'],
            'bg-color-surface-container color-on-surface',
          )}
        >
          <th className={cn('text-center py-3')}>نام و نام خانوادگی سرپرست</th>
          <th className="py-3"> نوع مسافر </th>
          <th> کد ملی</th>
          {passengersInfo?.passportNum && <th> شماره پاسپورت </th>}
          {passengersInfo?.passportExp !== '0' && <th> تاریخ انقضای پاسپورت </th>}
          {passengersInfo?.passportNum && <th> کشور صادر کننده پاسپورت </th>}
        </tr>
      </thead>
      <tbody className="bg-color-surface-container-low rounded-bottom">
        <tr>
          <td className="py-3">{passengersInfo?.fullName}</td>
          <td>{passengersInfo?.passengerType}</td>
          <td>{passengersInfo?.nationalcode}</td>
          {passengersInfo?.passportNum && <td>{passengersInfo?.passportNum}</td>}
          {passengersInfo?.passportExp !== '0' && <td> {formattedDate}</td>}
          {passengersInfo?.passportNum && <td>{passengersInfo?.passportIssuer}</td>}
          {/* <td>{passengersInfo?.quantity}</td> */}
        </tr>
      </tbody>
    </table>
  );
};

export default DesktopTourPassengerInfo;
