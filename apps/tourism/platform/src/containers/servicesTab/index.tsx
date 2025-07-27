import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { ParsedUrlQuery } from 'querystring';

import { RecentSearchCards } from 'containers/recentSearchCards';
import BusSearchTicket from 'module/bus/search';
import FlightSearchTicket from 'module/flights/tickets/ticket/searchTicket';
import HotelTicketsSearchBox from 'module/hotel/ticketsSearchBox';
import InternationalFlightsTicketsSearchBox from 'module/internationalFlight/ticketsSearchBox';
import TrainSearchTicket from 'module/train/tickets/components/searchTicket';
import { InformPanel, StickySearchBar } from './components';
import Service from './service';
import { Search as TourSearchTicket } from 'module/tour';

import styles from './servicesTab.module.scss';

export const shouldRecentSearchCradsRender = (serviceName = '') =>
  /^(flights|international|train|bus|hotel|tour)$/.test(serviceName);

const isSearchPage = (query: ParsedUrlQuery, activeTab?: string) => {
  const serviceName = activeTab?.split('/')[0];

  if (serviceName && ['train', 'bus'].includes(serviceName)) {
    return Object.keys(query).length > 1;
  }

  return true;
};

const ServicesTab = ({ device, activeTab }: { device?: string; activeTab?: string }) => {
  const { query } = useRouter();

  const searchBoxBottomRef = useRef<HTMLDivElement>(null);

  const [stickySearchIsVisible, setStickySearchIsVisible] = useState(false);

  let timeout: NodeJS.Timeout;

  const handleScrollEnd = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      let isVisible = false;
      const gap = searchBoxBottomRef.current?.getBoundingClientRect().top;
      gap && gap < 80 && (isVisible = true);
      setStickySearchIsVisible(isVisible);
    }, 50);
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScrollEnd);
    return () => {
      document.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  const handleStickySearchBoxClick = () => {
    window.scrollTo(0, 400);
  };

  return (
    <>
      <div
        className={cn(
          styles['search-card'],
          (activeTab === 'flights' ||
            activeTab === 'train' ||
            activeTab === 'bus' ||
            activeTab === 'international' ||
            activeTab === 'tour' ||
            activeTab === 'tour/moreinfo/[name]' ||
            activeTab === 'hotel') &&
            styles['search-card--landing'],
        )}
        style={{ marginTop: device == 'mobile' ? '0px' : '' }}
      >
        <Service device={device} />
        <div className={styles['search-card__content']}>
          {(activeTab === 'flights' ||
            activeTab === 'flights/[id]' ||
            activeTab === 'flights/airlines/[name]') && (
            <FlightSearchTicket
            // lastSearch={flightLastSearch}
            />
          )}
          {(activeTab == 'train' ||
            activeTab === 'train/[id]' ||
            activeTab === 'train/companies/[name]') && <TrainSearchTicket />}
          {(activeTab == 'bus' || activeTab === 'bus/[id]') && <BusSearchTicket />}
          {(activeTab == 'international' || activeTab === 'international/[id]') && (
            <InternationalFlightsTicketsSearchBox />
            // <UnavailableService title="پرواز خارجی" />
          )}
          {(activeTab == 'hotel' || activeTab === 'hotel/[id]') && <HotelTicketsSearchBox />}
          {(activeTab == 'tour' ||
            activeTab === 'tour/[id]' ||
            activeTab === 'tour/moreinfo/[name]') && <TourSearchTicket />}
          <div ref={searchBoxBottomRef} className={styles['search-box-bottom']}></div>
        </div>
        <InformPanel activeTab={activeTab} />
      </div>
      {shouldRecentSearchCradsRender(activeTab) && <RecentSearchCards />}
      {isSearchPage(query, activeTab) && (
        <StickySearchBar visible={stickySearchIsVisible} onClick={handleStickySearchBoxClick} />
      )}
    </>
  );
};

export default ServicesTab;
