import React, { useEffect, useRef, useState } from 'react';

import router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { default as classNames, default as cn } from 'classnames';
import { cloneDeep, isEqual } from 'lodash';
import { useDispatch } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { ParsedUrlQuery } from 'querystring';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

import Button from 'components/button';
import EmptyResult from 'components/emptyResult';
import HeaderHoc from 'components/headerHoc';
import ProgressBar from 'components/progressBar';
import Skeleton from 'components/skeleton';
import skeletonStyles from 'components/skeleton/skeleton.module.scss';
import AvailableDates from 'containers/availableDate';
import { TicketsFilter } from 'containers/ticketsFilter';
import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { createTicketsFilterState } from 'containers/ticketsFilter/utils';
import { TicketsFilterChips } from 'containers/ticketsFilterChips';
import { useGetLotties } from 'module/general/config/hooks/useGetLotties';
import { useMinPrices } from 'services/bus/minPrices';
import { BusPrepareResponse } from 'services/bus/order/interface';
import { BusTicketResponse, BusTickets, ErrorResponse } from 'services/bus/tickets/interface';
import { busDataObject } from 'store/slices/ecommerce/ecomerceSlice';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';
import { removeCookie, setCookie } from 'utils/helpers/coockieHelper';
import { QueryType } from 'utils/helpers/global';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { Device } from 'utils/interface';
import { TLocation, TQueryObject } from '../search/types';
import { checkQueryDiff, queryToLocation } from '../search/utils';
import SortTicket from './components/sortTicket';
import Tickets from './components/ticket-list';
import {
  useGetBusTypes,
  useGetCompanies,
  useGetStations,
  useGetTickets,
  useHandleFilter,
  useInitTicketsFilterState,
  usePrepareRequestHandler,
  useSelectTicket,
} from './hooks';
import { FullCapacity } from './components/FullCapacity';

import { FilterIcon } from 'assets/icons';
import style from './styles.module.scss';

interface Props {
  device: Device;
  isLoginCall: boolean;
}

const toFilterChipsState = (sections: TicketsFilterStateType) =>
  cloneDeep(sections).map((section) => {
    section.title =
      {
        departureTimeRanges: '',
        stations: 'مبدا',
        'stations-destination': 'مقصد',
        busTypes: '',
        companyNames: '',
      }[section.id] || '';
    return section;
  });

const BusTicketList = ({ device, isLoginCall }: Props) => {
  const filtersBox = useRef<HTMLDivElement>(null);
  const { query } = useRouter();
  const [locations, setLocations] = useState<TLocation>();
  const [path, setPath] = useState<ParsedUrlQuery | null>(null);
  const { checkExpiry } = useExpireContext();
  const { busLottie } = useGetLotties();

  useEffect(() => {
    localStorage.setItem('search-query', JSON.stringify(query));
  }, [query]);

  const { prepareRequestHandler, requestIdData, loadingPrepare } =
    usePrepareRequestHandler(isLoginCall);
  const {
    tickets,
    filtrableTicketData,
    coveragePercent,
    busTicketsLoading,
    isFinished,
    getBusListError,
    fullCapacity,
  } = useGetTickets(requestIdData as BusPrepareResponse);

  const {
    handleTicketsFilterIconClick,
    handleTicketsFilterChange,
    handleDesktopTicketsFilterChange,
    handleTicketsFilterChipsChange,
    handleTicketsFilterSubmit,
    handleRemoveTicketsFilterClick,
    handleDesktopRemoveTicketsFilterClick,
    bottomSheetIsVisible,
    setBottomSheetIsVisible,
    ticketsFilterState,
    setTicketsFilterState,
    ticketsFilterStateBeforeBottomSheetOpen,
    bottomSheetSubmitted,
    filtersLength,
  } = useHandleFilter(filtrableTicketData as BusTickets);

  const { initTicketsFilterState } = useInitTicketsFilterState(filtrableTicketData as BusTickets);
  const { stations } = useGetStations(filtrableTicketData as BusTickets);
  const { busTypes } = useGetBusTypes(filtrableTicketData as BusTickets);
  const { companies } = useGetCompanies(filtrableTicketData as BusTickets);

  const { data: daysContents } = useMinPrices(locations);

  const dispatch = useDispatch();

  useEffect(() => {
    setTicketsFilterState(createTicketsFilterState(query as QueryType, initTicketsFilterState));
  }, [stations, busTypes, companies]);

  useEffect(() => {
    if (!isLoginCall) {
      prepareRequestHandler();
    }
  }, []);

  useEffect(() => {
    if (query.id) {
      queryToLocation(query as TQueryObject).then((newLocation) => {
        setLocations(newLocation);
      });
    }
  }, [query?.id]);

  useEffect(() => {
    setPath(query);
    const isQueryChanged = checkQueryDiff(query, path);
    if (!path || isQueryChanged) prepareRequestHandler();
  }, [query]);

  useEffect(() => {
    if (isFinished) {
      const busEvent = new BusTrackingEvent();
      const dataLayerObject: busViewListItemModel = {
        query,
        data: tickets,
      };
      dispatch(busDataObject({ data: dataLayerObject }));
      busEvent.viewItemList(dataLayerObject as busViewListItemModel);
    }
  }, [isFinished, query]);

  const { handleSelectTicket } = useSelectTicket();

  useEffect(() => {
    if (requestIdData?.requestId) {
      removeCookie('uuid');
      setCookie('uuid', requestIdData.requestId, Number(requestIdData.validSeconds));

      localStorage.setItem('uuid-expiry', JSON.stringify(Number(requestIdData?.validSeconds)));
      const timeout = setTimeout(
        () => checkExpiry({ type: 'uuid', expired: true }),
        Number(requestIdData?.validSeconds) * 1000,
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [tickets, requestIdData]);

  useEffect(() => {
    if (bottomSheetIsVisible) {
      ticketsFilterStateBeforeBottomSheetOpen.current = ticketsFilterState;
    } else {
      if (bottomSheetSubmitted.current) {
        bottomSheetSubmitted.current = false;
      } else {
        setTicketsFilterState(ticketsFilterStateBeforeBottomSheetOpen.current);
      }
    }
  }, [bottomSheetIsVisible]);

  const [filterSectionIsInvisible, setFilterSectionIsInvisible] = useState(false);
  useEffect(() => {
    const shouldFilterInvisible =
      !tickets.length && isFinished && isEqual(ticketsFilterState, initTicketsFilterState);

    setFilterSectionIsInvisible(shouldFilterInvisible);
  }, [tickets, isFinished, ticketsFilterState, initTicketsFilterState]);

  return (
    <>
      {device === Device.mobile ? (
        <>
          <HeaderHoc>
            <span className="text-3 text-weight-500">
              {locations
                ? `${
                    locations?.origin?.cityName?.split('-')?.[0] ??
                    (query?.id as string)?.split('-')?.[0]
                  } - ${
                    locations?.destination?.cityName?.split('-')?.[0] ??
                    (query?.id as string)?.split('-')?.[1]
                  }`
                : undefined}
            </span>
          </HeaderHoc>

          <div className={`${classNames('mx-n3')} `}>
            <AvailableDates returning={false} disable={!isFinished} daysContents={daysContents} />

            {fullCapacity && <FullCapacity hasTickets={!!tickets.length} />}
            {!getBusListError &&
              (!!tickets.length || !isEqual(ticketsFilterState, initTicketsFilterState)) && (
                <div
                  className={cn(
                    style['mobile-sticky-utilities'],
                    (!isFinished || fullCapacity) && style.hide,
                  )}
                >
                  <div
                    className={cn(style['filter-icon'], filtersLength !== 0 && style['has-filter'])}
                    onClick={handleTicketsFilterIconClick}
                  >
                    <FilterIcon />
                    {filtersLength !== 0 && (
                      <span className={style['filter-number-badge']}>{filtersLength}</span>
                    )}
                  </div>
                  <div className={style['mobile-sticky-chips']}>
                    <TicketsFilterChips
                      state={toFilterChipsState(ticketsFilterState)}
                      onChange={(e) => {
                        handleTicketsFilterChipsChange(e);
                      }}
                    />
                    {!!tickets.length && <SortTicket device={device} />}
                  </div>
                </div>
              )}
          </div>
          {!getBusListError ? (
            <div className="col-12">
              {(loadingPrepare || !isFinished) && (
                <>
                  <div className="col-4 m-auto mt-2">
                    <Player src={busLottie} className="player" loop autoplay />
                  </div>
                  <div
                    className="d-flex justify-content-center p-3 pt-0"
                    dangerouslySetInnerHTML={{
                      __html: requestIdData?.loadingMessage || '',
                    }}
                  ></div>
                  <div className="col-8 m-auto mb-3">
                    <ProgressBar percent={coveragePercent} />
                  </div>
                  <div className="my-3">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton
                        type="ticket"
                        key={index.toString() + 'busTickets'}
                        rtl
                        uniqueKey="0"
                        className={skeletonStyles.skeleton__tickets}
                      />
                    ))}
                  </div>
                </>
              )}
              {tickets?.length ? (
                <Tickets
                  onSelectTicket={handleSelectTicket}
                  tickets={tickets as BusTicketResponse['busInfo']}
                  isLoading={busTicketsLoading}
                  isMobile={true}
                  isFullCapacity={fullCapacity}
                />
              ) : (
                <>
                  {isFinished && !fullCapacity && (
                    <div className="col-10 pb-2 m-auto">
                      {!isEqual(ticketsFilterState, initTicketsFilterState) ? (
                        <EmptyResult
                          className="m-5"
                          type="filter"
                          handleClick={handleDesktopRemoveTicketsFilterClick}
                          message="اتوبوسی با فیلتر اعمال شده پیدا نشد."
                        />
                      ) : (
                        <EmptyResult
                          className="m-5"
                          type="bus-search"
                          isMobile={true}
                          handleClick={() => router.push('/bus')}
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              <BottomSheet
                // blocking={!uuidExpired}
                open={bottomSheetIsVisible}
                onDismiss={() => {
                  setBottomSheetIsVisible(false);
                }}
                // skipInitialTransition
                snapPoints={({ maxHeight }) => maxHeight * 0.9}
              >
                <div className={style['mobile-tickets-filter']}>
                  <div className={style.header}>
                    <div className={style.title}>مرتب‌‌ سازی و فیلتر</div>
                    <button
                      className={style['remove-filters']}
                      onClick={handleRemoveTicketsFilterClick}
                    >
                      حذف فیلترها
                    </button>
                  </div>
                  <TicketsFilter
                    state={ticketsFilterState}
                    onChange={(e) => {
                      handleTicketsFilterChange(e);
                    }}
                  />
                  <Button
                    btnType="submit"
                    className={classNames(style['submit-button'], 'btn-primary')}
                    onClick={handleTicketsFilterSubmit}
                  >
                    اعمال فیلترها
                  </Button>
                </div>
              </BottomSheet>
            </div>
          ) : (
            <>
              <div className="col-8 pb-2 m-auto">
                <EmptyResult
                  className="m-5"
                  type="busError"
                  error={getBusListError as ErrorResponse}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {!getBusListError ? (
            <>
              {(loadingPrepare || !isFinished) && (
                <>
                  <div className="text-center">
                    <div className="d-flex">
                      <div className="col-2 m-auto mt-5">
                        <Player src={busLottie} loop autoplay />
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-center pt-0 p-3 text-center"
                      dangerouslySetInnerHTML={{
                        __html: requestIdData?.loadingMessage || '',
                      }}
                    />
                    <div className="col-4 m-auto mb-3">
                      <ProgressBar percent={coveragePercent} />
                    </div>
                  </div>
                </>
              )}

              {loadingPrepare ? (
                <>
                  <div className="row rtl">
                    <div className="col-3 d-flex">
                      <Skeleton
                        type="filter"
                        rtl
                        uniqueKey="filter"
                        className="bg-color-white h-100 p-2"
                        height="100%"
                        width="100%"
                      />
                    </div>
                    <div className="col-9">
                      <Skeleton
                        type="sort"
                        rtl
                        uniqueKey="sort"
                        className="bg-color-white p-2 mb-3"
                        height="50"
                        width="100%"
                      />
                      {[...Array(6)].map((item, index) => (
                        <Skeleton
                          type="ticket"
                          key={index.toString() + 'busTicketSkeleton'}
                          rtl
                          uniqueKey="ticket"
                          className={skeletonStyles.skeleton__tickets}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className={cn('pb-2', filterSectionIsInvisible ? 'col-12' : 'col-9')}>
                      {!isFinished ? (
                        <Skeleton
                          type="sort"
                          rtl
                          uniqueKey="sort"
                          className="bg-color-white p-2 mb-3"
                          height="50"
                          width="100%"
                        />
                      ) : (
                        <>
                          <AvailableDates
                            returning={false}
                            disable={!isFinished}
                            daysContents={daysContents}
                          />
                          {fullCapacity && <FullCapacity hasTickets={!!tickets.length} />}
                          {!getBusListError && !!tickets.length && !fullCapacity && (
                            <SortTicket device={device} />
                          )}
                        </>
                      )}
                      {tickets.length ? (
                        <>
                          <Tickets
                            onSelectTicket={handleSelectTicket}
                            tickets={tickets as BusTicketResponse['busInfo']}
                            isLoading={busTicketsLoading}
                            isFullCapacity={fullCapacity}
                          />
                        </>
                      ) : isFinished ? (
                        <div className="col-6 pb-2 m-auto">
                          {!isEqual(ticketsFilterState, initTicketsFilterState) ? (
                            <EmptyResult
                              className="m-5"
                              type="filter"
                              handleClick={handleDesktopRemoveTicketsFilterClick}
                              message="اتوبوسی با فیلتر اعمال شده پیدا نشد."
                            />
                          ) : (
                            !fullCapacity && (
                              <EmptyResult
                                className="m-5"
                                type="bus-search"
                                isMobile={false}
                                handleClick={prepareRequestHandler}
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <>
                          {[...Array(6)].map((item, index) => (
                            <Skeleton
                              type="ticket"
                              key={index.toString() + 'busSkeleton'}
                              rtl
                              uniqueKey="ticket"
                              className={skeletonStyles.skeleton__tickets}
                            />
                          ))}
                        </>
                      )}
                    </div>
                    <div
                      className="col-3 position-relative"
                      style={{
                        display: filterSectionIsInvisible ? 'none' : 'block',
                      }}
                    >
                      {!isFinished ? (
                        <Skeleton
                          type="filter"
                          rtl
                          uniqueKey="filter"
                          className="bg-color-white h-100 p-2"
                          height="100%"
                          width="100%"
                        />
                      ) : (
                        <section ref={filtersBox} className={style.filters}>
                          <div className="px-3 pt-3">
                            {!!ticketsFilterState.length && (
                              <div className={style['desktop-filters-header']}>
                                <div className={style.title}>فیلتر بر اساس</div>
                                {!isEqual(ticketsFilterState, initTicketsFilterState) && (
                                  <button
                                    className={style['remove-filters']}
                                    onClick={handleDesktopRemoveTicketsFilterClick}
                                  >
                                    حذف فیلترها
                                  </button>
                                )}
                              </div>
                            )}
                            <TicketsFilterChips
                              state={toFilterChipsState(ticketsFilterState)}
                              onChange={(e) => {
                                handleTicketsFilterChipsChange(e);
                              }}
                            />
                          </div>
                          <TicketsFilter
                            state={ticketsFilterState}
                            onChange={(e) => {
                              handleDesktopTicketsFilterChange(e);
                            }}
                          />
                        </section>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="col-8 pb-2 m-auto">
              <EmptyResult
                className="m-5"
                type="busError"
                error={getBusListError as ErrorResponse}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
export default BusTicketList;
