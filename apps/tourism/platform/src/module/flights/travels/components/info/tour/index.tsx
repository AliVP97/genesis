import { FC } from 'react';

type InfoType = {
  info: {
    cityName: string;
    rrn: string;
    hotelName: string;
    fromDate: string;
    toDate: string;
  };
};

const TravelTourInfo: FC<InfoType> = ({ info }) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between color-grey-1 p-3">
        <div className="d-flex flex-column text-3">
          <div className="pb-3">
            <span>شهر و استان</span>
          </div>
          <div className="pb-3">
            <span>شماره سفارش</span>
          </div>
          <div className="pb-3">
            <span>نام هتل</span>
          </div>
          <div className="pb-3">
            <span>تاریخ رفت</span>
          </div>
          <div>
            <span>تاریخ برگشت</span>
          </div>
        </div>
        <div className="d-flex flex-column text-start text-3">
          <div className="pb-3">
            <span className="en">{info.cityName || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.rrn || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.hotelName || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.fromDate || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.toDate || '--'}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default TravelTourInfo;
