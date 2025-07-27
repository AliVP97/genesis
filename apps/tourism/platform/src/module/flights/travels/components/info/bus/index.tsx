import cn from 'classnames';

type InfoType = {
  ticketNumber: string;
  orderNumber: string;
  company: string;
  date: string;
  return: boolean;
  seats: string;
};

const TravelBusInfo = ({ info }: { info: InfoType }) => {
  return (
    <>
      <div
        className={cn(
          'd-flex flex-row justify-content-between color-grey-1 p-3',
          info.return ? 'border-bottom border-color-light' : '',
        )}
      >
        <div className="d-flex flex-column text-3">
          <div className="pb-3">
            <span>شماره خرید:</span>
          </div>
          <div className="pb-3">
            <span>شماره بلیط: </span>
          </div>
          <div className="pb-3">
            <span> تعاونی: </span>
          </div>
          <div className="pb-3">
            <span>تاریخ و ساعت حرکت:</span>
          </div>
          <div>
            <span>شماره صندلی:</span>
          </div>
        </div>
        <div className="d-flex flex-column text-start text-3">
          <div className="pb-3">
            <span className="en">{info.orderNumber || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.ticketNumber || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.company}</span>
          </div>
          <div className="pb-3">
            <span>{info.date}</span>
          </div>
          <div className="pb-3">
            <span>{info.seats}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default TravelBusInfo;
