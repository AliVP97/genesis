import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import { TDictionary } from 'services/internationalFlight/flight/interface';

import Detail from '../component/detail';
import SelectedTicketHeader from '../component/selectedTicketHeader';

import { useGetTicketDetail } from '../hooks/useGetTicketDetail';
import Ticket from '../ticket';
import styles from './selectedTicket.module.scss';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';
import { useRouter } from 'next/router';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import getPassengerCount from './helpers/getPassengerCount';
import { ItineraryV2 } from '../types/api';
import FlightDetails from '../FlightDetails';

type TSelectedInternationalTicketProps = {
  orderData: GetOrderResponseV2;
  isLoading: boolean;
};

const SelectedInternationalTicket = ({
  orderData,
  isLoading,
}: TSelectedInternationalTicketProps) => {
  const [isOpenDetails, setIsOpenDetails] = useState<string>();
  const { ticketDetailMutate, isTicketDetailLoading, ticketDetailData } = useGetTicketDetail();
  const router = useRouter();
  const query = router.query;
  const requestId = String(query.requestId) ?? '';

  const { internationalFlightCartObject } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  useEffect(() => {
    if (
      internationalFlightCartObject instanceof Object &&
      'ticketsData' in internationalFlightCartObject
    ) {
      const internationalFlightTracking = new FlightInternationalTracking();
      internationalFlightTracking.beginCheckout(internationalFlightCartObject as viewItemListModel);
    }
  }, []);
  const dictionary: TDictionary = {
    airlineDictionary: {
      ...orderData?.airlineDictionary,
      ...ticketDetailData?.airlineDictionary,
    },
    aircraftDictionary: {
      ...orderData?.airlineDictionary,
      ...ticketDetailData?.airlineDictionary,
    },
    iataDictionary: {
      ...orderData?.iataDictionary,
      ...ticketDetailData?.iataDictionary,
    },
  };

  const itinerary = orderData?.order?.itinerary;
  const summaryTitle = `مجموع قیمت برای ${getPassengerCount(
    orderData?.order?.itinerary?.fareBreakdowns,
  )} نفر`;

  return (
    <>
      {orderData && (
        <Accordion allowZeroExpanded>
          <AccordionItem
            key={orderData?.order?.itinerary?.itineraryId}
            dangerouslySetExpanded={isOpenDetails == orderData?.order?.itinerary?.itineraryId}
          >
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className={styles['selected-ticket']}>
                  <SelectedTicketHeader dictionary={dictionary} orderData={orderData} />
                  <Ticket
                    summaryTitle={summaryTitle}
                    curveEdges={false}
                    selectedTicket={true}
                    disable={isLoading}
                    itinerary={itinerary as ItineraryV2}
                    dictionary={dictionary}
                    key={orderData?.order?.itinerary?.itineraryId}
                    showDetails={isOpenDetails === orderData?.order?.itinerary?.itineraryId}
                    expandAccordion={() =>
                      isOpenDetails && isOpenDetails == orderData?.order?.itinerary?.itineraryId
                        ? setIsOpenDetails('')
                        : setIsOpenDetails(orderData?.order?.itinerary?.itineraryId)
                    }
                    requestId={requestId}
                    handleClick={ticketDetailMutate}
                    isLoading={isTicketDetailLoading}
                    setShowDetails={setIsOpenDetails}
                  />
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <Detail
                selectedTicket={true}
                ticket={ticketDetailData?.itinerary as TIntelTicket}
                isLoading={isTicketDetailLoading}
                dictionary={dictionary}
                showDetails={isOpenDetails === orderData?.order?.itinerary?.itineraryId}
                expandAccordion={() =>
                  isOpenDetails && isOpenDetails == orderData?.order?.itinerary?.itineraryId
                    ? setIsOpenDetails('')
                    : setIsOpenDetails(orderData?.order?.itinerary?.itineraryId)
                }
                isMobile={false}
                requestId={requestId}
                setShowDetails={setIsOpenDetails}
              />
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      )}
      <FlightDetails
        hasSubmitButton={false}
        response={ticketDetailData}
        isLoading={isTicketDetailLoading}
      />
    </>
  );
};

export default SelectedInternationalTicket;
