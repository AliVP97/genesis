import styles from 'module/internationalFlight/tickets/tickets.module.scss';
import cn from 'classnames';
import { TabType } from 'module/internationalFlight/tickets/interface';
import ticketDetailStyle from 'module/internationalFlight/tickets/component/intelFlightDetail/ticketDetail.module.scss';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DetailHeader } from 'module/internationalFlight/tickets/component/detailHeader';
import React, { Dispatch, useState } from 'react';
import IntelFlightDetail from 'module/internationalFlight/tickets/component/intelFlightDetail';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import { DetailFooter } from 'module/internationalFlight/tickets/component/detailFooter';
import Divider from 'components/divider';
import { IntelRefundPolicies } from 'module/internationalFlight/tickets/component/intelRefundPolicies';
import { VisaPolicies } from '../visaPolicies';
import Spinner from 'components/spinner';

interface DetailProps {
  ticket: TIntelTicket;
  showDetails: boolean;
  setShowDetails: Dispatch<string>;
  expandAccordion: (() => void) | undefined;
  isMobile: boolean;
  dictionary: TDictionary;
  isLoading?: boolean;
  requestId: string;
  selectedTicket?: boolean;
  index?: number;
}

const Detail = ({
  ticket,
  showDetails,
  expandAccordion,
  isMobile,
  dictionary,
  isLoading,
  requestId,
  selectedTicket,
  index,
}: DetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);
  const handleSelectTab = (str: TabType) => setActiveTab(str);
  return (
    <>
      {isMobile ? (
        <BottomSheet
          open={showDetails}
          onDismiss={expandAccordion}
          skipInitialTransition
          snapPoints={({ maxHeight }) => maxHeight * 0.98}
          className={styles['tickets__bottomSheet']}
          header={
            <DetailHeader
              activeTab={activeTab}
              handleSelectTab={handleSelectTab}
              onClose={expandAccordion}
              isDesktop={!isMobile}
            />
          }
        >
          <div
            className={cn(
              ticketDetailStyle['ticket-detail'],
              isLoading ? 'd-flex justify-content-center' : '',
            )}
          >
            {activeTab === TabType.DETAIL ? (
              <>
                {isLoading ? (
                  <div className={cn(ticketDetailStyle['loader'], 'mt-5')} />
                ) : (
                  <>
                    <IntelFlightDetail
                      ticket={ticket}
                      dictionary={dictionary}
                      isLoading={isLoading || false}
                      isDesktop={!isMobile}
                    />
                    <DetailFooter ticket={ticket} requestId={requestId} isDesktop={!isMobile} />
                  </>
                )}
              </>
            ) : activeTab === TabType.POLICY ? (
              <>
                <IntelRefundPolicies ticket={ticket as TIntelTicket} isLoading={isLoading!} />
              </>
            ) : (
              <VisaPolicies ticket={ticket as TIntelTicket} />
            )}
          </div>
        </BottomSheet>
      ) : (
        <div
          className={cn(
            styles['desktop-detail'],
            'd-flex flex-row flex-row-reverse bg-white mb-3 px-4',
          )}
        >
          {isLoading ? (
            <div
              style={{ height: '445px' }}
              className="text-center col-12 d-flex align-items-center"
            >
              <Spinner />
            </div>
          ) : (
            <>
              {' '}
              <div className="d-flex flex-column col-7 h-100">
                <DetailHeader
                  activeTab={activeTab}
                  handleSelectTab={handleSelectTab}
                  onClose={expandAccordion}
                  isDesktop={!isMobile}
                />
                <div
                  className={cn(
                    ticketDetailStyle['ticket-detail'],
                    isLoading ? 'd-flex justify-content-center' : '',
                  )}
                >
                  {activeTab === TabType.DETAIL ? (
                    <>
                      {isLoading ? (
                        <div className={cn(ticketDetailStyle['loader'], 'mt-5')} />
                      ) : (
                        <>
                          <IntelFlightDetail
                            ticket={ticket}
                            dictionary={dictionary}
                            isLoading={isLoading || false}
                            isDesktop={!isMobile}
                          />
                        </>
                      )}
                    </>
                  ) : activeTab === TabType.POLICY ? (
                    <IntelRefundPolicies ticket={ticket as TIntelTicket} isLoading={isLoading!} />
                  ) : (
                    <VisaPolicies ticket={ticket as TIntelTicket} />
                  )}
                </div>
              </div>
              <div className="d-flex flex-column col-5 rtl pt-3 pe-5">
                <div className="d-flex flex-row align-items-center pt-1 mb-3">جزییات قیمت</div>
                <Divider type="horizontal" />
                <DetailFooter
                  selectedTicket={selectedTicket}
                  ticket={ticket}
                  requestId={requestId}
                  isDesktop={!isMobile}
                  index={index}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Detail;
