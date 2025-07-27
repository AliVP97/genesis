import cn from 'classnames';

type InfoType = {
  pnr: string;
  flightNumber: string;
  ticketNumber: string;
  airline: string;
  date: string;
  return: boolean;
};

const TravelInterNationalFlightInfo = ({ info }: { info: InfoType }) => {
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
            <span>شماره PNR: </span>
          </div>
          <div className="pb-3">
            <span>شماره پرواز:</span>
          </div>
          <div className="pb-3">
            <span>شماره بلیط:</span>
          </div>
          <div className="pb-3">
            <span> شرکت هواپیمایی: </span>
          </div>
          <div className="pb-3">
            <span> تاریخ و ساعت حرکت: </span>
          </div>
        </div>
        <div className="d-flex flex-column text-start text-3">
          <div className="pb-3">
            <span className="en">{info.pnr || '-'}</span>
          </div>
          <div className="pb-3">
            <span>{info.flightNumber || '-'}</span>
          </div>
          <div className="pb-3">
            <span>{info.ticketNumber || '-'}</span>
          </div>
          <div className="pb-3">
            <span>{info.airline || '-'}</span>
          </div>
          <div className="pb-3 ltr">
            <span>{info.date}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default TravelInterNationalFlightInfo;
