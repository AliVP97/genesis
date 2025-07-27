import cn from 'classnames';

type InfoType = {
  line: string;
  company: string;
  date: string;
  serialNumber: string;
  trainNo: string;
  return: boolean;
};

const TravelTrainInfo = ({ info }: { info: InfoType }) => {
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
            <span>شماره سریال:</span>
          </div>
          <div className="pb-3">
            <span>شماره قطار:</span>
          </div>
          <div className="pb-3">
            <span>شرکت ریلی:</span>
          </div>

          <div className="pb-3">
            <span>تاریخ و ساعت حرکت:</span>
          </div>
        </div>
        <div className="d-flex flex-column text-start text-3">
          <div className="pb-3">
            <span>{info.serialNumber || '--'}</span>
          </div>
          <div className="pb-3">
            <span>{info.trainNo}</span>
          </div>
          <div className="pb-3">
            <span>{info.company}</span>
          </div>
          <div className="pb-3">
            <span>{info.date}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default TravelTrainInfo;
