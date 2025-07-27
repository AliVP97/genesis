import { TrainTicket } from 'module/train/tickets/interface';
import { TicketType } from 'module/flights/tickets/ticket/interface';

export const selectedTicketScrollTo = (
  returningDate: string | string[] | undefined,
  selected: TrainTicket | TicketType,
  scroll: boolean,
) => {
  if (!!returningDate && !!selected && !scroll) return { marginTop: '120px' };
  else if (!!returningDate && !!selected && scroll) return { top: '30px' };
  else if (!returningDate && !selected && scroll) return { top: 0 };
  else if (!!returningDate && !selected && scroll) return { top: 0 };
  else return {};
};
