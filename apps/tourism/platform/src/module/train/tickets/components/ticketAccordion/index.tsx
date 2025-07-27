import cn from 'classnames';
import { TicketType, TrainTicket } from 'module/train/tickets/interface';
import {
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Detail from '../detail';
import Ticket from '../ticket';
import detailStyles from '../detail/detail.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
type TTicketAccordionProps = {
  isOpenDetail: string | undefined;
  ticket: TicketType;
  isLoading: boolean;
  isReturn: boolean | undefined;
  onSelectTicket: (data: TrainTicket) => void;
  setIsOpenDetail: React.Dispatch<React.SetStateAction<string | undefined>>;
  index?: number;
};

function TicketAccordion({
  isOpenDetail,
  isLoading,
  ticket,
  isReturn,
  onSelectTicket,
  setIsOpenDetail,
  index,
}: TTicketAccordionProps) {
  const { query } = useRouter();
  const [isCoupe, setIsCoupe] = useState<boolean>(query['wantCompartment'] === 'true');
  const { trainData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  return (
    <>
      <AccordionItem dangerouslySetExpanded={isOpenDetail == ticket.trainId}>
        <AccordionItemHeading>
          <AccordionItemButton>
            <Ticket
              isCoupe={isCoupe}
              disable={isLoading}
              handleSelect={onSelectTicket}
              ticket={ticket as TicketType}
              key={ticket.trainId}
              isOpenDetail={isOpenDetail === ticket.trainId}
              expandAccordion={() => {
                if (isOpenDetail && isOpenDetail == ticket.trainId) {
                  setIsOpenDetail('');
                } else {
                  if (trainData) {
                    const trainEvent = new TrainTrackingEvent();
                    const selectedTicket: trainViewListItemModel = {
                      ...(trainData as trainViewListItemModel),
                      viewDetail: Array.isArray(ticket) ? ticket : [ticket],
                      itemPosition: index ?? 0,
                    };
                    trainEvent.selectItem(selectedTicket as trainViewListItemModel);
                  }
                  setIsOpenDetail(ticket.trainId);
                }
              }}
              returning={isReturn}
            />
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel className={cn(detailStyles['detail__wrapper'], 'accordion__panel ')}>
          <Detail
            setIsCoupe={setIsCoupe}
            ticket={ticket as TicketType}
            openedDetailId={isOpenDetail}
          />
        </AccordionItemPanel>
      </AccordionItem>
    </>
  );
}

export default TicketAccordion;
