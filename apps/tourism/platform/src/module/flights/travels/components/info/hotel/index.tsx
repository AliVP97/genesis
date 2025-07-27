import cn from 'classnames';

type InfoType = {
  children?: React.ReactNode | React.ReactNode[];
  location: string;
  orderNumber?: string;
  checkInDateTime: string;
  checkOutDateTime: string;
  price?: number;
};

const TravelHotelInfo = ({
  location,
  orderNumber,
  checkInDateTime,
  checkOutDateTime,
  price,
}: InfoType) => {
  return (
    <>
      <div className={cn('d-flex flex-row justify-content-between color-grey-1 p-3')}>
        <div className="d-flex flex-column text-3">
          <div className="pb-3">
            <span> شهر و استان: </span>
          </div>
          <div className="pb-3">
            <span>شماره رزرو: </span>
          </div>
          <div className="pb-3">
            <span> تاریخ ورود: </span>
          </div>
          <div>
            <span> تاریخ خروج: </span>
          </div>
          <div className="mt-3">
            <span> مبلغ کل: </span>
          </div>
        </div>
        <div className="d-flex flex-column text-start text-3">
          <div className="pb-3">
            <b>{location || '--'}</b>
          </div>
          <div className="pb-3">
            <b>{orderNumber || '--'}</b>
          </div>
          <div className="pb-3">
            <b>{checkInDateTime}</b>
          </div>
          <div>
            <b>{checkOutDateTime}</b>
          </div>
          <div className="color-primary mt-3 d-flex justify-content-end align-items-center">
            <h5 className="m-0">{Number(price).toLocaleString() || '--'}</h5>
            <small className="pe-2">ریال</small>
          </div>
        </div>
      </div>
    </>
  );
};
export default TravelHotelInfo;
