import SelectedTicket from 'module/train/tickets/components/selectedTicket';
import { TicketType } from 'module/train/tickets/interface';
import { useRouter } from 'next/router';
import { TrainOrder } from 'services/train/orders/interface';
import { resetFilters } from 'utils/helpers/resetFilters';

type CheckoutDesktopTickets = {
  order: TrainOrder;
};

const CheckoutDesktopTickets = ({ order }: CheckoutDesktopTickets) => {
  const { push } = useRouter();
  const handleChangeTowardTicket = () => {
    const query = localStorage.getItem('train_search_query');
    if (query) {
      resetFilters(JSON.parse(query), push);
    } else {
      push('/train');
    }
  };

  return (
    <>
      <div className="ltr">
        {order && (
          <SelectedTicket
            isMobile={false}
            order={order}
            selectedTicket={order?.trips?.[0].trainInfo as TicketType}
            handleChangeTowardTicket={handleChangeTowardTicket}
          />
        )}

        {order?.trips!.length > 1 && (
          <SelectedTicket
            isMobile={false}
            order={order}
            selectedTicket={order?.trips?.[1].trainInfo as TicketType}
            handleChangeTowardTicket={handleChangeTowardTicket}
            isReturn={true}
          />
        )}
      </div>
    </>
  );
};

export default CheckoutDesktopTickets;
