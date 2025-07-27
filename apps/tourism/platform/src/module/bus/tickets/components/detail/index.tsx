import React from 'react';
import styles from './detail.module.scss';
import cn from 'classnames';
import RefundPolicy from '../refundPolicy';
import ticketDetailStyle from '../busDetail/ticketDetail.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { BusInfo } from 'services/bus/tickets/interface';
import { MiddleStations } from '../middleStations';

interface Props {
  ticket: BusInfo;
  isSelected?: boolean;
  openedDetailId?: string;
}

const Detail = ({ ticket }: Props) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className={cn(styles['detail__content'], 'justify-content-between')}>
      <div className="d-flex flex-column col-7 mx-3">
        <div
          className={cn(
            'd-flex text-4 text-weight-300 color-black-2 pb-2',
            styles['detail__item--divider'],
          )}
        >
          قوانین استرداد
        </div>
        <div className={cn(ticketDetailStyle['ticket-detail'], 'd-flex')}>
          <RefundPolicy data={ticket as BusInfo} />
        </div>
      </div>
      <div className="d-flex flex-column col-4 mx-3">
        <div
          className={cn(
            'd-flex text-4 text-weight-300 color-black-2 pb-2',
            styles['detail__item--divider'],
          )}
        >
          توقف در شهرهای
        </div>
        <div
          className={cn(ticketDetailStyle['ticket-detail'], 'd-flex flex-column p-3')}
          style={{ height: isMobile ? '' : '300px' }}
        >
          {ticket?.roadMap?.length != 0 && (
            <div className="d-flex flex-column">
              {<MiddleStations stations={ticket?.roadMap || []} />}
            </div>
          )}
          {Number(ticket?.distance) != 0 && (
            <div className="d-flex flex-column">
              <span className="text-3 text-weight-500">فاصله تا مقصد :</span>
              <span className="text-2 color-grey-1 pt-2">{ticket?.distance}کیلومتر</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
