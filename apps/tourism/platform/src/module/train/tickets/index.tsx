import React, { useState } from 'react';

import cn from 'classnames';
import { Accordion } from 'react-accessible-accordion';
import { useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { DetailFooter } from 'module/train/tickets/components/detailFooter';
import { DetailHeader } from 'module/train/tickets/components/detailHeader';
import Ticket from 'module/train/tickets/components/ticket';
import { RootState } from 'store';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useResponsive } from 'utils/hooks/useResponsive';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { MiddleStations } from './components/middleStations';
import RefundPolicy from './components/refundPolicy';
import TicketAccordion from './components/ticketAccordion';
import TrainDetail from './components/trainDetail';
import { TabType, TicketList, TicketType, TrainTicket } from './interface';

import ticketDetailStyle from './components/trainDetail/ticketDetail.module.scss';
import styles from './tickets.module.scss';

interface Props {
  className?: string;
  isLoading: boolean;
  tickets: TicketList;
  onSelectTicket: (data: TrainTicket, index?: number) => void;
  oneWay: boolean;
  isReturn?: boolean;
  isFullCapacity?: boolean;
}

const Tickets = ({
  className,
  isLoading,
  tickets,
  onSelectTicket,
  oneWay,
  isReturn,
  isFullCapacity,
}: Props) => {
  const { isMobile } = useResponsive();

  const [showDetail, setShowDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);
  const [isOpenDetail, setIsOpenDetail] = useState<string>();
  const [ticketIndex, setTicketIndex] = useState<number>();

  const { lazyLogin } = useAuthContext();

  const handleSelectTab = (str: TabType) => setActiveTab(str);
  const { trainData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);

  const handleSelectShowTicket = async (ticket: TicketType, index?: number) => {
    try {
      setSelectedTicket(ticket);

      await lazyLogin();

      setTicketIndex(index);
      setShowDetail(true);
      if (trainData) {
        const trainEvent = new TrainTrackingEvent();
        const selectedTicketData: trainViewListItemModel = {
          ...(trainData as trainViewListItemModel),
          viewDetail: Array.isArray(ticket) ? ticket : [ticket],
          itemPosition: index ?? 0,
        };
        trainEvent.selectItem(selectedTicketData as trainViewListItemModel);
      }
    } catch (error) {
      setTicketIndex(NaN);
      setSelectedTicket(null);
    }
  };
  const { uuidExpired } = useSelector((state: RootState) => state.expireTimeSlice);

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedTicket(null);
  };

  const submitTicket = (ticket: TrainTicket) => {
    onSelectTicket(ticket, ticketIndex);
    if (!oneWay && !isReturn) setShowDetail(false);
  };

  const isSuperApp = useIsSuperApp();

  return (
    <div
      className={cn(
        className,
        styles.tickets,
        'd-flex flex-column',
        `${isSuperApp ? styles['is-superapp'] : ''}`,
      )}
    >
      {!isFullCapacity && (
        <span className="text-2 black-1 d-block text-end mt-2 mb-2 ">
          {isReturn ? (
            <>
              بلیط برگشت را از <strong>{tickets[0].originName}</strong> به{' '}
              <strong>{tickets[0].destinationName}</strong> انتخاب کنید
            </>
          ) : (
            <>بلیط رفت را انتخاب کنید</>
          )}
        </span>
      )}

      {!isMobile ? (
        <Accordion allowZeroExpanded className={styles.tickets__accordion}>
          {isFullCapacity && <div className={styles['full-capacity']}>قطارهای تکمیل ظرفیت</div>}
          {tickets.map((ticket, index) => (
            <TicketAccordion
              key={index.toString() + ticket?.trainId}
              ticket={ticket}
              isLoading={isLoading}
              isOpenDetail={isOpenDetail}
              isReturn={isReturn}
              onSelectTicket={(data) => onSelectTicket(data, index)}
              setIsOpenDetail={setIsOpenDetail}
              index={index}
            />
          ))}
        </Accordion>
      ) : (
        <>
          {isFullCapacity && <div className={styles['full-capacity']}>قطارهای تکمیل ظرفیت</div>}
          {tickets.map((ticket, index) => (
            <Ticket
              disable={isLoading}
              handleClick={(data) => handleSelectShowTicket(data, index)}
              ticket={ticket as TicketType}
              key={ticket.trainId + 'train' + index.toString()}
              isMobile={isMobile}
              isOpenDetail={isOpenDetail === ticket.trainId}
              returning={isReturn}
            />
          ))}
        </>
      )}

      {/*mobile*/}
      <BottomSheet
        open={showDetail}
        onDismiss={handleCloseDetail}
        blocking={!uuidExpired}
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
        footer={<DetailFooter onSelectTicket={submitTicket} data={selectedTicket as TicketType} />}
      >
        <div className={cn(ticketDetailStyle['ticket-detail'])}>
          {activeTab === TabType.DETAIL ? (
            <TrainDetail ticket={selectedTicket as TicketType} isDesktop={!isMobile} />
          ) : activeTab === TabType.MIDDLESTATIONS ? (
            <MiddleStations
              id={selectedTicket?.trainId}
              isDesktop={!isMobile ? true : false}
              selectedTicket={selectedTicket}
            />
          ) : (
            <RefundPolicy data={selectedTicket as TicketType} />
          )}
        </div>
      </BottomSheet>
    </div>
  );
};

export default Tickets;
