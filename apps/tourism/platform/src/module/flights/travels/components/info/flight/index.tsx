import cn from 'classnames';

type InfoType = {
  airline: string;
  flightNo: string;
  date: string;
  pnr: string;
  return: boolean;
};

const TravelFlightInfo = ({ info }: { info: InfoType }) => {
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
            <span>کد مرجع:</span>
          </div>
          <div className="pb-3">
            <span>شماره پرواز:</span>
          </div>
          <div className="pb-3">
            <span>شرکت هواپیمایی:</span>
          </div>
          <div className="pb-3">
            <span>تاریخ و ساعت حرکت:</span>
          </div>
        </div>
        <div className="d-flex flex-column text-start text-3">
          <div className="pb-3">
            <span className="en">{info.pnr || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.flightNo}</span>
          </div>
          <div className="pb-3">
            <span>{info.airline}</span>
          </div>
          <div className="pb-3">
            <span>{info.date}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default TravelFlightInfo;
