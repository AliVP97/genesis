import cn from 'classnames';
import styles from './selected-ticket.module.scss';
import { FC, useState } from 'react';
import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import { BusInfo } from 'services/bus/tickets/interface';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Ticket from '../ticket';
import Detail from '../detail';
import detailStyles from '../detail/detail.module.scss';

interface Props {
  selectedTicket?: BusInfo;
}

const SelectedTicket: FC<Props> = ({
  selectedTicket = JSON.parse(
    typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('bus_ticket') as string) : '{}',
  ) as BusInfo,
}) => {
  const departureDate = useTimeConvertor(selectedTicket?.departureDate?.toString());
  const [isOpenDetail, setIsOpenDetail] = useState<string>();
  return (
    <div className={styles['selectedTicket']}>
      <div className={cn(styles['selectedTicket__header'], 'px-3')}>
        <div className="col-6 d-flex">
          <div className="ps-1">{selectedTicket?.originCity}</div>
          به
          <div className="pe-1">{selectedTicket?.destinationCity}</div>
          <div className="pe-1">
            - {departureDate.dayName} {departureDate.date} {departureDate.month}
          </div>
        </div>
      </div>
      <div>
        <Accordion allowZeroExpanded className={styles['selectedTicket__accordion']}>
          <AccordionItem dangerouslySetExpanded={!!isOpenDetail}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <Ticket
                  ticket={
                    (delete selectedTicket?.remainingSeats as true) && (selectedTicket as BusInfo)
                  }
                  isOpenDetail={isOpenDetail === selectedTicket?.busId}
                  isSelected={true}
                  expandAccordion={() =>
                    isOpenDetail ? setIsOpenDetail('') : setIsOpenDetail(selectedTicket?.busId)
                  }
                />
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel
              className={cn(detailStyles['detail__wrapper'], 'accordion__panel ')}
            >
              <Detail ticket={selectedTicket as BusInfo} />
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SelectedTicket;
