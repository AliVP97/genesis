import React, { useState, useMemo } from 'react';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import styles from './selectedTicket.module.scss';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Ticket from 'module/flights/tickets/ticket/index';
import Detail from 'module/flights/tickets/detail';
import detailStyles from 'module/flights/tickets/detail/detail.module.scss';
import cn from 'classnames';
import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import { GetOrder } from 'services/domestic/flight/interface';
import { useQueryClient } from 'react-query';
import { GetDomesticTicketResponse } from 'services/domestic/flight/interface';
import { captureException } from '@sentry/nextjs';
import { definitions } from 'types/shoppingorder';

interface Props {
  ticket: TicketType | definitions['apishoppingorderFlightInfo'];
  order?: GetOrder;
  onChangeTowardTicket: () => void;
  isReturn?: boolean;
}

const SelectedTicketItem = ({ ticket, order, onChangeTowardTicket, isReturn }: Props) => {
  const [isOpenDetail, setIsOpenDetail] = useState<string>();
  const departureDate = useTimeConvertor(ticket?.departure?.date?.toString());
  const queryClient = useQueryClient();
  const flightList = queryClient.getQueryData<GetDomesticTicketResponse>(['getTicketList']);

  const returningDateOnLocalStorage = useMemo(() => {
    if (typeof window !== undefined) {
      try {
        return JSON.parse(String(localStorage.getItem('search-query'))).returningDate || null;
      } catch (err) {
        captureException(err);
      }
    }
  }, []);

  let ticketLabel;
  if (isReturn) {
    ticketLabel = 'تغییر برگشت';
  } else if ((flightList?.flightQueryResult?.length || 0) > 1 || returningDateOnLocalStorage) {
    ticketLabel = 'تغییر رفت';
  } else {
    ticketLabel = 'تغییر بلیط';
  }

  return (
    <div className={styles['selectedTicket']}>
      <div className={cn(styles['selectedTicket__header'], 'px-3')}>
        <div className="col-6 d-flex">
          <div className="ps-1">{ticket?.departure?.airport?.city?.name?.farsi}</div>
          به
          <div className="pe-1">{ticket?.arrival?.airport?.city?.name?.farsi}</div>
          <div className="pe-1">
            - {departureDate.dayName} {departureDate.date} {departureDate.month}
          </div>
        </div>

        <div onClick={onChangeTowardTicket} className="col-6 ltr cursor-pointer">
          {ticketLabel}
        </div>
      </div>
      <div>
        <Accordion allowZeroExpanded className={styles['selectedTicket__accordion']}>
          <AccordionItem dangerouslySetExpanded={!!isOpenDetail}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <Ticket
                  ticket={ticket as TicketType}
                  isOpenDetail={isOpenDetail === ticket?.flightID}
                  isSelected={true}
                  expandAccordion={() =>
                    isOpenDetail ? setIsOpenDetail('') : setIsOpenDetail(ticket?.flightID)
                  }
                />
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel
              className={cn(detailStyles['detail__wrapper'], 'accordion__panel ')}
            >
              <Detail ticket={ticket as TicketType} order={order} />
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SelectedTicketItem;
