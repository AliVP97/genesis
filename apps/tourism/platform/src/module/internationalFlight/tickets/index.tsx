import React, { Dispatch, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './tickets.module.scss';
import cn from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import Ticket from './ticket';
import { useGetTicketDetail } from './hooks/useGetTicketDetail';
import Detail from './component/detail';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import { useIntersectionObserver } from 'utils/hooks/useIntersectionObserver';
import { LoaderAnimation } from 'assets/animations';
import BannerContainer from './BannerContainer';
import { AvailabilityListResponseV2, ItineraryV2 } from './types/api';
import getSearchResult from './helpers/getSearchResult';
import { SearchResult } from './types/search';
import FlightDetails from './FlightDetails';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

function getPlayerClassName(shouldHide: boolean): string | undefined {
  let className = 'w-25 d-flex mx-auto';

  if (shouldHide) {
    className += ' d-none';
  }

  return className;
}

const useIsDisabled = (ticketCount: number) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const timeoutIdRef = useRef<number>();
  const prevTicketCount = useRef<number>(0);

  /**
   * Disable ticket card only count is changed not every time request is called.
   * Add comment: This hook is used to disable the ticket card for a short period of time (300ms) when the ticket count changes.
   */
  useEffect(() => {
    if (prevTicketCount.current !== ticketCount) {
      prevTicketCount.current = ticketCount;
      setIsDisabled(true);

      timeoutIdRef.current = window.setTimeout(() => {
        setIsDisabled(false);
      }, 300);
    } else {
      setIsDisabled(false);

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [ticketCount]);

  return isDisabled;
};

interface Props {
  isLoading?: boolean;
  tickets: AvailabilityListResponseV2;
  isMobile?: boolean;
  localData: ItineraryV2[];
  setLocalData: Dispatch<ItineraryV2[]>;
  requestId: string;
}

const Tickets = ({ tickets, isMobile, requestId, localData, setLocalData }: Props) => {
  const isDisabled = useIsDisabled(tickets.itineraries?.length ?? 0);
  const isSuperApp = useIsSuperApp();
  const [isOpenDetails, setIsOpenDetails] = useState<string>();
  const dictionary: TDictionary = {
    iataDictionary: tickets.iataDictionary,
    aircraftDictionary: tickets.airlineDictionary,
    airlineDictionary: tickets.airlineDictionary,
  };
  const { ticketDetailMutate, isTicketDetailLoading, ticketDetailData } = useGetTicketDetail();
  const scrollRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(scrollRef, {
    freezeOnceVisible: false,
  });
  const [localDataLength, setLocalDataLength] = useState(0);
  const ticketDetailDictionary = {
    iataDictionary: ticketDetailData?.iataDictionary,
    aircraftDictionary: ticketDetailData?.airlineDictionary,
    airlineDictionary: ticketDetailData?.airlineDictionary,
  };
  const playerClassName = getPlayerClassName(localData.length === tickets.itineraries!.length);

  useEffect(() => {
    if (!!entry?.isIntersecting) {
      const ticketData = tickets.itineraries!;

      if (ticketData.length === localData.length) {
        return;
      }
      const count =
        ticketData.length - localData.length >= 10 ? 10 : ticketData.length - localData.length;

      const newLocalData = [
        ...localData,
        ...ticketData.slice(localData.length, localData.length + count),
      ] as ItineraryV2[];
      setLocalDataLength(newLocalData.length);
      setLocalData(newLocalData);
    }
  }, [!!entry?.isIntersecting]);

  useEffect(() => {
    const ticketData = tickets.itineraries!;
    setLocalData(ticketData.slice(0, localDataLength));
  }, [tickets]);

  const handleExpandAccordion = (ticket: ItineraryV2) => () => {
    if (isOpenDetails && isOpenDetails === ticket.itineraryId) {
      setIsOpenDetails('');
    } else {
      setIsOpenDetails(ticket.itineraryId);
    }
  };

  const searchResult: SearchResult = useMemo(
    () => getSearchResult(localData, tickets.banners),
    [localData, tickets.banners],
  );

  return (
    <>
      <div
        className={cn(
          styles['tickets'],
          'd-flex flex-column',
          `${isSuperApp ? styles['is-superapp'] : ''}`,
        )}
      >
        {!isMobile ? (
          <>
            <Accordion allowZeroExpanded className={styles['tickets__accordion']}>
              {searchResult.map(({ type, data }, index) => (
                <Fragment key={index}>
                  {type === 'banner' && <BannerContainer data={data} />}
                  {type === 'ticket' && (
                    <AccordionItem dangerouslySetExpanded={isOpenDetails === data.itineraryId}>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          <Ticket
                            disable={isDisabled}
                            itinerary={data}
                            dictionary={dictionary}
                            key={data.itineraryId + 'internationalFlights' + index.toString()}
                            showDetails={isOpenDetails === data.itineraryId}
                            expandAccordion={handleExpandAccordion(data)}
                            setShowDetails={setIsOpenDetails}
                            requestId={requestId}
                            handleClick={ticketDetailMutate}
                            isLoading={isTicketDetailLoading}
                            index={index}
                          />
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <Detail
                          ticket={ticketDetailData?.itinerary as TIntelTicket}
                          isLoading={isTicketDetailLoading}
                          dictionary={ticketDetailDictionary}
                          showDetails={isOpenDetails === data.itineraryId}
                          expandAccordion={handleExpandAccordion(data)}
                          isMobile={!!isMobile}
                          requestId={requestId}
                          setShowDetails={setIsOpenDetails}
                        />
                      </AccordionItemPanel>
                    </AccordionItem>
                  )}
                </Fragment>
              ))}
              <div ref={scrollRef} className={playerClassName}>
                <Player src={LoaderAnimation} className="player" loop autoplay />
              </div>
            </Accordion>
          </>
        ) : (
          <>
            {searchResult?.map(({ type, data }, index) => (
              <Fragment key={index}>
                {type === 'banner' && <BannerContainer data={data} />}
                {type === 'ticket' && (
                  <>
                    <Ticket
                      disable={isDisabled}
                      dictionary={dictionary}
                      itinerary={data}
                      key={data.itineraryId + 'internationalFlights2' + index.toString()}
                      isMobile={isMobile}
                      showDetails={isOpenDetails === data.itineraryId}
                      setShowDetails={setIsOpenDetails}
                      handleClick={ticketDetailMutate}
                      isLoading={isTicketDetailLoading}
                      requestId={requestId}
                      index={index}
                    />
                    <Detail
                      ticket={ticketDetailData?.itinerary as TIntelTicket}
                      isLoading={isTicketDetailLoading}
                      dictionary={ticketDetailDictionary}
                      setShowDetails={setIsOpenDetails}
                      expandAccordion={handleExpandAccordion(data)}
                      isMobile={isMobile}
                      requestId={requestId}
                      showDetails={isOpenDetails === data.itineraryId}
                    />
                  </>
                )}
              </Fragment>
            ))}
            <div ref={scrollRef} className={playerClassName}>
              <Player src={LoaderAnimation} className="player" loop autoplay />
            </div>
          </>
        )}
      </div>
      <FlightDetails
        hasSubmitButton
        requestId={requestId}
        response={ticketDetailData}
        isLoading={isTicketDetailLoading}
      />
    </>
  );
};

export default Tickets;
