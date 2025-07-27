import React from 'react';
import cn from 'classnames';
import styles from './ticketDetail.module.scss';
import FlightDetail from './flightDetail';
import RefundPolicy from './refundPolicy';
import { TabType, TicketType } from 'module/flights/tickets/ticket/interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface Props {
  data: TicketType;
  activeTab?: TabType;
  onSelectTicket?: (data: TicketType) => void;
}

const TicketDetail = ({ data, activeTab }: Props) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className={cn(styles['ticket-detail'])}>
      {activeTab === TabType.DETAIL ? (
        <FlightDetail ticket={data} isDesktop={!isMobile} />
      ) : (
        <RefundPolicy data={data} />
      )}
    </div>
  );
};

export default TicketDetail;
