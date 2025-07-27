import React, { useState } from 'react';

import cn from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { BusInfo, BusTicketResponse } from 'services/bus/tickets/interface';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import Ticket from '../ticket';
import { TabType } from '../../interface';
import BusDetail from '../busDetail';
import RefundPolicy from '../refundPolicy';
import { DetailHeader } from '../detailHeader';
import Detail from '../detail';
import { DetailFooter } from '../detailFooter';

import styles from './tickets.module.scss';
import detailStyles from '../detail/detail.module.scss';
import ticketDetailStyle from '../busDetail/ticketDetail.module.scss';

interface Props {
  isLoading: boolean;
  tickets: BusTicketResponse['busInfo'];
  isMobile?: boolean;
  onSelectTicket: (data: BusInfo, index?: number) => void;
  isFullCapacity?: boolean;
}

const Tickets = ({ isLoading, tickets, isMobile, onSelectTicket, isFullCapacity }: Props) => {
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);
  const [selectedTicket, setSelectedTicket] = useState<BusInfo | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<string>();
  const [ticketIndex, setTicketIndex] = useState<number>();

  const handleSelectTab = (str: TabType) => setActiveTab(str);

  const handleSelectShowTicket = (ticket: BusInfo, index: number) => {
    setShowDetail(true);
    setSelectedTicket(ticket);
    setTicketIndex(index);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedTicket(null);
  };

  const submitTicket = () => {
    onSelectTicket(selectedTicket as BusInfo, ticketIndex);
  };

  const isSuperApp = useIsSuperApp();

  return (
    <div
      className={cn(
        styles.tickets,
        'd-flex flex-column mt-2',
        `${isSuperApp ? styles['is-superapp'] : ''}`,
      )}
    >
      {!isMobile ? (
        <Accordion allowZeroExpanded className={styles.tickets__accordion}>
          {isFullCapacity && <div className={styles['full-capacity']}>اتوبوس‌های تکمیل ظرفیت</div>}
          {tickets?.map((ticket, index) => (
            <AccordionItem
              key={index.toString() + ticket?.busId}
              dangerouslySetExpanded={isOpenDetail == ticket.busId}
            >
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Ticket
                    disable={isLoading}
                    ticket={ticket as BusInfo}
                    key={ticket.busId + 'ticketList' + index.toString()}
                    handleSelect={(data) => onSelectTicket(data, index)}
                    isOpenDetail={isOpenDetail === ticket.busId}
                    expandAccordion={() =>
                      isOpenDetail && isOpenDetail == ticket.busId
                        ? setIsOpenDetail('')
                        : setIsOpenDetail(ticket.busId)
                    }
                  />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className={cn(detailStyles.detail__wrapper, 'accordion__panel ')}>
                <Detail ticket={ticket as BusInfo} openedDetailId={isOpenDetail} />
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <>
          {isFullCapacity && <div className={styles['full-capacity']}>اتوبوس‌های تکمیل ظرفیت</div>}
          {tickets?.map((ticket, index) => (
            <Ticket
              disable={isLoading}
              handleClick={(data) => handleSelectShowTicket(data, index)}
              ticket={ticket as BusInfo}
              key={ticket.busId + 'ticketsList' + index.toString()}
              isMobile={isMobile}
              isOpenDetail={isOpenDetail === ticket.busId}
            />
          ))}
        </>
      )}

      {/*mobile*/}
      <BottomSheet
        open={showDetail}
        blocking={false}
        onDismiss={handleCloseDetail}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.98}
        className={styles.tickets__bottomSheet}
        header={
          <DetailHeader
            activeTab={activeTab}
            handleSelectTab={handleSelectTab}
            onClose={handleCloseDetail}
          />
        }
        footer={<DetailFooter onSelectTicket={submitTicket} />}
      >
        <div className={cn(ticketDetailStyle['ticket-detail'])}>
          {activeTab === TabType.DETAIL ? (
            <BusDetail
              ticket={selectedTicket as BusInfo}
              isDesktop={!isMobile}
              openedDetailId={isOpenDetail}
            />
          ) : (
            <RefundPolicy data={selectedTicket as BusInfo} />
          )}
        </div>
      </BottomSheet>
    </div>
  );
};

export default Tickets;
