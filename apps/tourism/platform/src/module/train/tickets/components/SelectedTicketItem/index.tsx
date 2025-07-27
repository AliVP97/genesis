import React, { useState } from 'react';
import styles from './selectedTicket.module.scss';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Ticket from 'module/train/tickets/components/ticket/index';
import detailStyles from '../detail/detail.module.scss';
import cn from 'classnames';
import { TicketType } from '../../interface';
import Detail from 'module/train/tickets/components/detail';
import { TrainOrder } from 'services/domestic/orders/interface';
import { useRouter } from 'next/router';

interface Props {
  ticket: TicketType;
  order?: TrainOrder;
  onChangeTowardTicket: () => void;
  isReturn?: boolean;
}

const SelectedTicketItem = ({ ticket, order, onChangeTowardTicket, isReturn }: Props) => {
  const { query } = useRouter();
  const [isOpenDetail, setIsOpenDetail] = useState<string>();
  const [isCoupe, setIsCoupe] = useState<boolean>(query['wantCompartment'] === 'true');
  const [totalPrice, setTotalPrice] = useState<string>('');
  return (
    <div className={styles['selectedTicket']}>
      <div className={cn(styles['selectedTicket__header'], 'px-3')}>
        <div className="col-6 d-flex">
          <div className="ps-1">{ticket.originName}</div>
          به
          <div className="pe-1">{ticket.destinationName}</div>
          <div className="pe-1">- {ticket.departureDateString}</div>
        </div>

        <div onClick={onChangeTowardTicket} className="col-6 ltr cursor-pointer">
          {isReturn ? 'تغییر برگشت' : 'تغییر رفت'}
        </div>
      </div>
      <div>
        <Accordion allowZeroExpanded className={styles['selectedTicket__accordion']}>
          <AccordionItem dangerouslySetExpanded={!!isOpenDetail}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <Ticket
                  order={order}
                  ticket={ticket as TicketType}
                  isOpenDetail={isOpenDetail === ticket.trainId}
                  isSelected={true}
                  totalPrice={totalPrice}
                  isCoupe={isCoupe}
                  returning={isReturn}
                  expandAccordion={() =>
                    isOpenDetail ? setIsOpenDetail('') : setIsOpenDetail(ticket.trainId)
                  }
                />
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel
              className={cn(detailStyles['detail__wrapper'], 'accordion__panel ')}
            >
              <Detail
                setIsCoupe={setIsCoupe}
                order={order}
                setTotalPrice={setTotalPrice}
                isSelected={true}
                ticket={ticket as TicketType}
              />
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SelectedTicketItem;
