import cn from 'classnames';
import { getDateTimeDetails } from 'module/flights/travels/helper/travelHelper';
import { TicketType } from 'module/train/tickets/interface';
import style from '../style.module.scss';

type EmptyMiddleStationProps = {
  selectedTicket: TicketType | null;
};

function EmptyMiddleStation({ selectedTicket }: EmptyMiddleStationProps) {
  const { hour, minute } = getDateTimeDetails(selectedTicket?.departureDate);
  const { hour: hourArrival, minute: minuteArrival } = getDateTimeDetails(
    selectedTicket?.arrivalDate,
  );
  return (
    <>
      <div className="d-none d-md-block">
        <div className={cn(style['middle__rows--stations'], 'col')}>
          <div className="col-2 my-2"> {1}</div>
          <div className={cn('col-6 my-2 color-primary text-weight-500')}>
            {selectedTicket?.originName}
          </div>
          <div className={cn('col-4 my-2 color-primary text-weight-500')}>
            {hour + ':' + minute}
          </div>
        </div>
        <div className={style['middle__divider--stations']} />
        <div className={cn(style['middle__rows--stations'], 'col')}>
          <div className="col-2 my-2"> {2}</div>
          <div className={cn('col-6 my-2 color-primary text-weight-500')}>
            {selectedTicket?.destinationName}
          </div>
          <div className={cn('col-4 my-2 color-primary text-weight-500')}>
            {hourArrival + ':' + minuteArrival}
          </div>
        </div>
      </div>
      <div className="d-md-none">
        <div className={cn(style['mobile-middle'], 'pt-4')}>
          <div className="justify-content-center d-flex color-black text-5 text-weight-500 mb-2">
            <div className="me-2">{hour + ':' + minute}</div>
            <div>{selectedTicket?.originName}</div>
          </div>
          <div className={cn(style['mobile-middle__timeline'], 'pt-4')}>
            <div className={style['mobile-middle__timeline__endpoints--first']} />
            <div className={style['mobile-middle__timeline__center-line']} />
            <div className={style['mobile-middle__timeline__content']}></div>
            <div className={style['mobile-middle__timeline__endpoints--last']} />
          </div>
          <div className="justify-content-center d-flex color-black text-weight-500 mt-2 text-5">
            <div className="me-2">{hourArrival + ':' + minuteArrival}</div>
            <div>{selectedTicket?.destinationName}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmptyMiddleStation;
