import { FC } from 'react';
import classNames from 'classnames';
import { TicketList, TicketType } from 'module/flights/tickets/ticket/interface';
import TicketWithDetail from 'module/flights/tickets/TicketWithDetail';
import styles from './style.module.scss';

type SuggestionProps = {
  isLoading: boolean;
  tickets: TicketList;
  onSelectTicket: (data: TicketType) => void;
  returning: boolean;
  oneWay: boolean;
  isMobile?: boolean;
  isReturn?: boolean;
  visible?: boolean;
};

export const Suggestion: FC<SuggestionProps> = (props) => {
  const { isLoading, tickets, onSelectTicket, returning, oneWay, isMobile, isReturn, visible } =
    props;

  const suggestionType = (type: string | undefined) => {
    if (type === 'SUGGESTION_TYPE_NEAREST') {
      return 'suggestion-type-nearest';
    }
    return 'suggestion-type-lowestPrice';
  };

  return visible ? (
    <div className={styles['container']}>
      {tickets.map((ticket) => (
        <div
          key={`suggestion-${ticket.flightID}`}
          className={classNames(
            styles['accordion-item'],
            ticket?.suggestType && styles[suggestionType(ticket?.suggestType)],
          )}
        >
          <div dir="rtl" className={styles['accordion-item__button']}>
            <span
              className={
                ticket?.suggestType == 'SUGGESTION_TYPE_NEAREST' ? 'color-primary' : 'color-green-4'
              }
            >
              {ticket?.categoryTitle}
            </span>
            <span className="mx-3">{ticket?.departure?.dateString}</span>
          </div>
          <div className="pt-4 pb-3 px-0 px-md-4 mx-3 mx-md-0 border-top border-color-light">
            <TicketWithDetail
              oneWay={oneWay}
              returning={returning}
              onSelectTicket={onSelectTicket}
              ticket={ticket}
              isLoading={isLoading}
              isReturn={isReturn}
              isMobile={isMobile}
            />
          </div>
        </div>
      ))}
    </div>
  ) : null;
};
