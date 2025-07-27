import { FC, useState } from 'react';
import cn from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import detailStyles from 'module/flights/tickets/detail/detail.module.scss';
import Ticket from 'module/flights/tickets/ticket';
import { TabType, TicketType } from 'module/flights/tickets/ticket/interface';
import TicketDetail from 'module/flights/tickets/ticket/ticketDetail';
import { DetailFooter } from 'module/flights/tickets/ticket/ticketDetail/footer';
import { DetailHeader } from 'module/flights/tickets/ticket/ticketDetail/header';
import Detail from './detail';
import styles from './tickets.module.scss';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';

type TicketWithDetailProps = {
  ticket: TicketType;
  isReturn?: boolean;
  isMobile?: boolean;
  isLoading?: boolean;
  returning: boolean;
  oneWay: boolean;
  onSelectTicket: (data: TicketType) => void;
  index?: number;
};

/**
 * A Ticket with detail section.
 *
 * In order to use this component separately wrap it in a Accordion component
 *
 * @see {@link https://react-accessible-accordion.springload.co.nz/}
 */

const TicketWithDetail: FC<TicketWithDetailProps> = ({
  ticket,
  isReturn,
  isMobile,
  isLoading,
  returning,
  oneWay,
  onSelectTicket,
  index,
}) => {
  const { uuidExpired } = useSelector((state: RootState) => state.expireTimeSlice);
  const [isOpenDetail, setIsOpenDetail] = useState<string>();
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);

  const domesticFlightTracking = new DomesticFlightTrackingEvent();
  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const handleSelectTab = (str: TabType) => setActiveTab(str);

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedTicket(null);
  };

  const submitTicket = (selectedTicket: TicketType) => {
    onSelectTicket(selectedTicket);
    if (!oneWay || returning) setShowDetail(false);
  };

  const handleSelectShowTicket = (ticketInfo: TicketType) => {
    if (domesticFlightData !== undefined && !(isOpenDetail === ticketInfo?.flightID)) {
      const flightData = {
        ...domesticFlightData,
        itinerary: [ticketInfo],
      };
      domesticFlightTracking.selectItem(flightData as propsModel, index as number);
    }
    setShowDetail(true);
    setSelectedTicket(ticketInfo);
  };

  return isMobile ? (
    <>
      <Ticket
        disable={isLoading}
        handleClick={handleSelectShowTicket}
        ticket={ticket as TicketType}
        key={ticket.flightID}
        isMobile
        isOpenDetail={isOpenDetail === ticket.flightID}
      />
      {/*mobile*/}
      <BottomSheet
        blocking={!uuidExpired}
        open={showDetail}
        onDismiss={handleCloseDetail}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.98}
        className={styles['tickets__bottomSheet']}
        header={
          <DetailHeader
            activeTab={activeTab}
            handleSelectTab={handleSelectTab}
            onClose={handleCloseDetail}
          />
        }
        footer={
          <DetailFooter
            returning={returning}
            setShowDetail={setShowDetail}
            onSelectTicket={submitTicket}
            data={selectedTicket as TicketType}
          />
        }
      >
        <TicketDetail activeTab={activeTab} data={selectedTicket as TicketType} />
      </BottomSheet>
    </>
  ) : (
    // TODO: Accordion component must wrap all AccordionItems
    // It's a temporary solution for avoiding conflict in nested accordions
    // Usually this issue happens when TicketWithDetail used directly
    <Accordion>
      <AccordionItem key={ticket.flightID} dangerouslySetExpanded={isOpenDetail == ticket.flightID}>
        <AccordionItemHeading>
          <AccordionItemButton>
            <Ticket
              disable={isLoading}
              handleSelect={onSelectTicket}
              ticket={ticket as TicketType}
              key={ticket.flightID}
              isOpenDetail={isOpenDetail === ticket.flightID}
              expandAccordion={() => {
                if (domesticFlightData !== undefined && !(isOpenDetail === ticket?.flightID)) {
                  const flightData = {
                    ...domesticFlightData,
                    itinerary: [ticket],
                  };
                  domesticFlightTracking.selectItem(flightData as propsModel, index as number);
                }

                isOpenDetail && isOpenDetail == ticket.flightID
                  ? setIsOpenDetail('')
                  : setIsOpenDetail(ticket.flightID);
              }}
              returning={isReturn}
            />
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel className={cn(detailStyles['detail__wrapper'], 'accordion__panel ')}>
          <Detail ticket={ticket as TicketType} />
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TicketWithDetail;
