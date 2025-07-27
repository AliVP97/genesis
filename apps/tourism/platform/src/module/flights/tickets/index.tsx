import cn from 'classnames';
import { TicketList, TicketType } from 'module/flights/tickets/ticket/interface';
import TicketWithDetail from './TicketWithDetail';
import styles from './tickets.module.scss';

interface Props {
  isLoading: boolean;
  tickets: TicketList;
  onSelectTicket: (data: TicketType, index: number) => void;
  returning: boolean;
  oneWay: boolean;
  isMobile: boolean;
  isReturn?: boolean;
}

const Tickets = ({
  isLoading,
  tickets,
  onSelectTicket,
  returning,
  oneWay,
  isMobile,
  isReturn,
}: Props) => {
  return (
    <div className={cn(styles['tickets'], 'd-flex flex-column')}>
      <div className={styles['tickets__accordion']}>
        {tickets.map((ticket, index) => (
          <TicketWithDetail
            key={ticket.flightID + 'domesticFlights' + index.toString()}
            ticket={ticket}
            isReturn={isReturn}
            isMobile={isMobile}
            isLoading={isLoading}
            returning={returning}
            oneWay={oneWay}
            onSelectTicket={(data) => onSelectTicket(data, index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Tickets;
