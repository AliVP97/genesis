import { FC } from 'react';
import classNames from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import { TicketList, TicketType } from 'module/flights/tickets/ticket/interface';
import TicketWithDetail from 'module/flights/tickets/TicketWithDetail';
import { ArrowDownIcon } from 'assets/icons';
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

  return visible ? (
    <Accordion className={styles['container']} allowZeroExpanded allowMultipleExpanded>
      <div dir="rtl" className={styles['title']}>
        پیشنهادهای هف‌هشتاد، در بازه ۷ روز از تاریخ انتخابی شما:
      </div>
      {tickets.map((ticket, index) => (
        <AccordionItem
          key={ticket.flightID}
          className={classNames(
            styles['accordion-item'],
            ticket?.suggestType && styles[ticket?.suggestType],
          )}
        >
          <AccordionItemButton dir="rtl" className={styles['accordion-item__button']}>
            <div className={styles['accordion-item__button__context']}>
              <span
                className={
                  ticket?.suggestType == 'SUGGESTION_TYPE_NEAREST'
                    ? 'color-primary'
                    : 'color-green-4'
                }
              >
                {ticket?.categoryTitle}
              </span>
              <span className="mx-3">{ticket?.departure?.dateString}</span>
            </div>
            <AccordionItemState>
              {({ expanded }) => (
                <div
                  className={classNames(
                    styles['accordion-item__button__icon'],
                    expanded && styles['accordion-item__button__icon--expanded'],
                  )}
                >
                  <ArrowDownIcon />
                </div>
              )}
            </AccordionItemState>
          </AccordionItemButton>
          <AccordionItemPanel className="pt-4 pb-3 px-0 px-md-4 mx-3 mx-md-0 border-top border-color-light">
            <TicketWithDetail
              oneWay={oneWay}
              returning={returning}
              onSelectTicket={onSelectTicket}
              ticket={ticket}
              isLoading={isLoading}
              isReturn={isReturn}
              isMobile={isMobile}
              index={index}
            />
          </AccordionItemPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ) : null;
};
