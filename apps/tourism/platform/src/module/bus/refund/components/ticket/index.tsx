import { Passenger } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';
import { TBusOrder } from 'services/bus/order/interface';
import Passengers from '../passengers';
import TicketInfo from '../ticketInfo';

type TTicketProps = {
  order: TBusOrder;
};

function Ticket({ order }: TTicketProps) {
  return (
    <>
      <div>
        <TicketInfo order={order} />
        <div className="d-none d-md-block">
          <div className={cn('color-on-surface w-100 pt-3 rounded-top text-end px-3')}>
            <Divider type="horizontal" className="pb-3" />
            <Passenger />
            <b className="pe-2"> مسافران</b>
          </div>
        </div>
        <div className="mt-3 mt-md-0">
          <Passengers order={order} />
        </div>
      </div>
    </>
  );
}

export default Ticket;
