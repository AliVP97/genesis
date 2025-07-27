import { useRouter } from 'next/router';

import SelectedTicket from 'module/train/tickets/components/selectedTicket';
import { TicketType } from 'module/train/tickets/interface';
import { resetFilters } from 'utils/helpers/resetFilters';

const PassengerDesktopTickets = () => {
  const { push } = useRouter();

  const handleChangeTowardTicket = () => {
    const query = localStorage.getItem('train_search_query');
    if (query) {
      resetFilters(JSON.parse(query), push);
    } else {
      push('/train');
    }
  };

  const trainSelectedTicket =
    typeof window !== 'undefined'
      ? (JSON.parse(sessionStorage.getItem('train_selected_ticket') as string) as TicketType[])
      : undefined;
  return (
    <>
      <div className="ltr">
        {trainSelectedTicket && (
          <SelectedTicket
            isMobile={false}
            selectedTicket={trainSelectedTicket?.[0] as TicketType}
            handleChangeTowardTicket={handleChangeTowardTicket}
          />
        )}

        {trainSelectedTicket?.[1] && (
          <SelectedTicket
            isMobile={false}
            selectedTicket={trainSelectedTicket?.[1] as TicketType}
            handleChangeTowardTicket={handleChangeTowardTicket}
            isReturn={true}
          />
        )}
      </div>
    </>
  );
};

export default PassengerDesktopTickets;
