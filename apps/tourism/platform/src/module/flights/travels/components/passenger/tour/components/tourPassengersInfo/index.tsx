import { FC } from 'react';
import { TTourPassengersInfo } from '../desktopTourPassengerInfo';
import styles from '../../../../../travels.module.scss';
import cn from 'classnames';

const TourPassengersInfo: FC<TTourPassengersInfo> = ({ passengersInfo }) => {
  const date = new Date(Number(passengersInfo.passportExp) * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  const formattedDate = `${year}/${month}/${day}`;
  return (
    <div className={cn(styles['Details__item'], 'text-3 px-3 py-2 mb-3')}>
      <div className="p-3 color-on-surface">
        <div className="d-flex justify-content-between">
          <span>نام و نام خانوادگی سرپرست</span>
          <span>{passengersInfo.fullName}</span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <span>نوع مسافر</span>
          <span>{passengersInfo.passengerType}</span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <span>کد ملی</span>
          <span>{passengersInfo.nationalcode}</span>
        </div>
        {passengersInfo.passportNum && (
          <>
            <div className="d-flex justify-content-between mt-3">
              <span>شماره پاسپورت</span>
              <span>{passengersInfo.passportNum}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span>تاریخ انقضای پاسپورت</span>
              <span>{formattedDate}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span>کشور صادرکننده‌ی پاسپورت</span>
              <span>{passengersInfo.passportIssuer}</span>
            </div>
          </>
        )}
        {/* <div className="d-flex justify-content-between mt-3">
          <span>تعداد مسافران</span>
          <span>{passengersInfo.quantity}</span>
        </div> */}
      </div>
    </div>
  );
};

export default TourPassengersInfo;
