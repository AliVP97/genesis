import EmptyResult from 'components/emptyResult';
import HeaderHoc from 'components/headerHoc';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  TDictionary,
  TInternationalAvailabilityListResponse,
  TInternationalPrepareResponse,
} from 'services/internationalFlight/flight/interface';
import { Device } from 'utils/interface';
import Tickets from '../tickets';
import { checkQueryDiff } from './helper';
import { useGetTickets } from './hooks/useGetTickets';
import { usePrepareRequestHandler } from './hooks/usePrepareRequestHandler';
import { SearchHistory } from './interface';
import Skeleton from 'components/skeleton';
import skeletonStyles from 'components/skeleton/skeleton.module.scss';
import { useHandleFilter } from '../tickets/hooks/useHandleFilter';
import { useInitTicketsFilterState } from '../tickets/hooks/useIntelTicketsFilterState';
import { usePriceMinMax } from '../tickets/hooks/usePriceMinMax';
import { useDurationMinMax } from '../tickets/hooks/useDurationMinMax';
import { createTicketsFilterState } from 'containers/ticketsFilter/utils';
import { QueryType } from 'utils/helpers/global';
import { filterTickets } from '../tickets/filterTickets';
import { cloneDeep, isEqual } from 'lodash';
import { FilterIcon, InfoIcon } from 'assets/icons';
import { TicketsFilterChips } from 'containers/ticketsFilterChips';
import SortTicket from '../tickets/component/sortTicket';
import style from './style.module.scss';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { TicketsFilter } from 'containers/ticketsFilter';
import Button from 'components/button';
import classNames from 'classnames';
import { removeCookie, setCookie } from 'utils/helpers/coockieHelper';
import AvailableDates from 'containers/availableDate';
import { RangeDatePicker } from 'components/rangeDatePicker';
import { useRangeDatePicker } from './hooks/useRangeDatePicker';
import { useGetLotties } from 'module/general/config/hooks/useGetLotties';
import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { TInternationalFlightSearch } from 'utils/helpers/localstorageHelper';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { AvailabilityListResponseV2, ItineraryV2 } from '../tickets/types/api';
import { useDispatch } from 'react-redux';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { internationalFlight } from 'store/slices/ecommerce/ecomerceSlice';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

interface Props {
  device: Device;
  isLoginCall: boolean;
  lastSearch?: TInternationalFlightSearch | undefined;
}

export const SearchIntFlight = ({ device, isLoginCall, lastSearch }: Props) => {
  const [path, setPath] = useState<ParsedUrlQuery | null>(null);
  const { query } = useRouter();
  const { intFlightLottie } = useGetLotties();
  const [locations, setLocations] = useState<null | SearchHistory>(null);
  const dispatch = useDispatch();

  const { prepareRequestHandler, requestIdData, loadingPrepare } =
    usePrepareRequestHandler(isLoginCall);

  const { ticketsData, isTicketsFetching, isTicketError } = useGetTickets(
    requestIdData as TInternationalPrepareResponse,
  );

  const desktopTicketsSorterRef = useRef<HTMLDivElement>(null);

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
    //The code below seems to be depricate, commented for test
    // desktopFilterChanged,
    setTicketsFilterState,
    ticketsFilterStateBeforeBottomSheetOpen,
    bottomSheetSubmitted,
    filtersLength,
  } = useHandleFilter(ticketsData as AvailabilityListResponseV2, desktopTicketsSorterRef);

  const { initTicketsFilterState } = useInitTicketsFilterState(
    ticketsData as AvailabilityListResponseV2,
  );

  const { priceMinMax } = usePriceMinMax(ticketsData as AvailabilityListResponseV2);
  const { durationMinMax } = useDurationMinMax(ticketsData as AvailabilityListResponseV2);

  useEffect(() => {
    setTicketsFilterState(createTicketsFilterState(query as QueryType, initTicketsFilterState));
  }, [query, priceMinMax, durationMinMax]);

  //The code below seems to be depricate, commented for test
  // useEffect(() => {
  //   if (desktopFilterChanged.current) {
  //     desktopFilterChanged.current = false;
  //     handleTicketsFilterSubmit();
  //   }
  // }, [ticketsFilterState]);

  useEffect(() => {
    bottomSheetIsVisible
      ? (ticketsFilterStateBeforeBottomSheetOpen.current = ticketsFilterState)
      : !bottomSheetSubmitted.current
        ? setTicketsFilterState(ticketsFilterStateBeforeBottomSheetOpen.current)
        : (bottomSheetSubmitted.current = false);
  }, [bottomSheetIsVisible]);

  const isFinished = Boolean(ticketsData?.isFinished);

  const dictionary: TDictionary = {
    iataDictionary: ticketsData?.iataDictionary,
    aircraftDictionary: ticketsData?.aircraftDictionary,
    airlineDictionary: ticketsData?.airlineDictionary,
  };

  const [localData, setLocalData] = useState<ItineraryV2[]>([]);
  const filteredTicketsData = useMemo((): AvailabilityListResponseV2 => {
    if (!ticketsData?.itineraries) return [] as AvailabilityListResponseV2;
    if (!ticketsData?.itineraries.length) return [] as AvailabilityListResponseV2;

    const itineraries = JSON.parse(JSON.stringify(ticketsData.itineraries)) as ItineraryV2[];

    if (!isFinished) {
      return ticketsData as AvailabilityListResponseV2;
    }

    return {
      ...ticketsData,
      itineraries: filterTickets(itineraries, query, dictionary),
    };
  }, [query, ticketsData]);

  const {
    getDateRange,
    handleSubmit: handleRangeDatePickerOnSubmit,
    calendarSystem: rangeDatePickerCalendarSystem,
    title: rangeDatePickerTitle,
  } = useRangeDatePicker();

  useEffect(() => {
    const last_search =
      lastSearch ||
      JSON.parse(localStorage?.getItem('international_flight_last_search') as string)?.[0];
    if (last_search) setLocations(last_search);
  }, []);

  const { checkExpiry } = useExpireContext();

  useEffect(() => {
    if (requestIdData?.requestId) {
      removeCookie('uuid');
      setCookie('uuid', requestIdData.requestId, Number(requestIdData.validUntil));
      const validDuration = Number(requestIdData?.validUntil) || 600; // default 10 minutes
      localStorage.setItem(
        'uuid-expiry',
        JSON.stringify((Date.now() / 1000 + validDuration) as number),
      );
      const timeout =
        validDuration &&
        setTimeout(() => checkExpiry({ type: 'uuid', expired: true }), validDuration * 1000);
      return () => {
        timeout && clearTimeout(timeout);
      };
    }
  }, [ticketsData, requestIdData]);

  useEffect(() => {
    setPath(query);
    const isQueryChanged = checkQueryDiff(query, path);
    if (!path || isQueryChanged) prepareRequestHandler();

    setRangeDatePickerRange(getDateRange(query));
  }, [query]);

  const [rangeDatePickerRange, setRangeDatePickerRange] = useState(getDateRange(query));
  useEffect(() => {
    if (ticketsData) {
      const queryStringData: viewItemListModel = {
        ticketsData,
        query,
        locations,
      };
      dispatch(internationalFlight({ data: queryStringData }));
    }
  }, [isTicketsFetching, query]);

  useEffect(() => {
    if (filteredTicketsData.isFinished) {
      const queryStringData: viewItemListModel = {
        ticketsData: filteredTicketsData,
        query,
        locations,
      };
      const internationalFlightTracking = new FlightInternationalTracking();
      internationalFlightTracking.viewItemList(queryStringData as viewItemListModel);
    }
  }, [isTicketsFetching, filteredTicketsData]);

  const toFilterChipsState = (sections: TicketsFilterStateType) =>
    cloneDeep(sections).map((section) => {
      section.title =
        {
          priceRange: '',
          departureDuration: 'رفت',
          returningDuration: 'برگشت',
          ticketType: '',
          departureTime: 'رفت',
          returningTime: 'برگشت',
          departureStops: 'رفت',
          returningStops: 'برگشت',
          airlines: '',
        }[section.id] || '';
      return section;
    });
  const fullCapacity =
    (filteredTicketsData as TInternationalAvailabilityListResponse)?.itineraries?.length != 0 &&
    (filteredTicketsData as TInternationalAvailabilityListResponse)?.itineraries?.every(
      (ticket) => ticket.availableSeat! == 0,
    );

  const ticketsCount = ticketsData?.itineraries?.length;
  const filteredTicketsCount = (filteredTicketsData as TInternationalAvailabilityListResponse)
    .itineraries?.length;

  const renderMobileContent = () => {
    const headerContent = (
      <>
        <HeaderHoc>
          <span className="text-3 text-weight-500">
            {locations
              ? locations?.origin?.data?.['cityTitle'] &&
                locations?.destination?.data?.['cityTitle'] &&
                `${locations?.origin?.data?.['cityTitle']} - ${locations?.destination?.data?.['cityTitle']}`
              : undefined}
          </span>
        </HeaderHoc>
        <div className={`${classNames('mx-n3')}`}>
          {query.tripMode === '1' ? (
            <AvailableDates hidden={!isFinished} returning={false} disable={loadingPrepare} />
          ) : (
            <RangeDatePicker
              hidden={!isFinished}
              title={rangeDatePickerTitle}
              range={rangeDatePickerRange}
              onSubmit={(range) => handleRangeDatePickerOnSubmit(range)}
              calendarSystem={rangeDatePickerCalendarSystem}
            />
          )}
        </div>
      </>
    );

    const controlContent = (
      <>
        {!isTicketError &&
          (Boolean(
            (filteredTicketsData as TInternationalAvailabilityListResponse)?.itineraries?.length,
          ) ||
            !isEqual(ticketsFilterState, initTicketsFilterState)) &&
          isFinished && (
            <>
              {fullCapacity && isFinished ? (
                <div className={style['fullcapacity']}>
                  <InfoIcon className={'fill-brown ms-1'} />
                  موجودی پرواز‌ها در این تاریخ به اتمام رسیده است.
                </div>
              ) : (
                <></>
              )}
              <div className={style['mobile-sticky-utilities']}>
                <div className={style['filter-icon']} onClick={handleTicketsFilterIconClick}>
                  {<FilterIcon />}
                  {filtersLength !== 0 && (
                    <span className={style['filter-number-badge']}>{filtersLength}</span>
                  )}
                </div>
                <div className={style['mobile-sticky-chips']}>
                  {/*<TicketsFilterChips*/}
                  {/*  state={toFilterChipsState(ticketsFilterState)}*/}
                  {/*  onChange={e => {*/}
                  {/*    handleTicketsFilterChipsChange(e);*/}
                  {/*  }}*/}
                  {/*/>*/}
                  {/*mobile filter*/}
                  {Boolean(filteredTicketsData?.itineraries?.length) && (
                    <SortTicket device={device} />
                  )}
                </div>
                <BottomSheet
                  open={bottomSheetIsVisible}
                  onDismiss={() => {
                    setBottomSheetIsVisible(false);
                  }}
                  snapPoints={({ maxHeight }) => maxHeight * 0.9}
                >
                  <div className={classNames(style['mobile-tickets-filter'], 'mb-5')}>
                    <div className={style['header']}>
                      <div className={style['title']}>مرتب‌‌ سازی و فیلتر</div>
                      <button
                        className={style['remove-filters']}
                        onClick={handleRemoveTicketsFilterClick}
                      >
                        حذف فیلترها
                      </button>
                    </div>
                    <div>
                      <TicketsFilter
                        state={ticketsFilterState}
                        onChange={(e) => {
                          handleTicketsFilterChange(e);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={classNames(
                      style['mobile-tickets-filter'],
                      'w-100 position-fixed fixed-bottom',
                    )}
                  >
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
            </>
          )}
      </>
    );

    const loadingContent = !isFinished && (
      <>
        <div className="col-6 mx-auto">
          <Player src={intFlightLottie} className="player" loop autoplay />
        </div>
        <div
          className="d-flex justify-content-center p-3"
          dangerouslySetInnerHTML={{
            __html: requestIdData?.loadingMessage || '',
          }}
        ></div>
      </>
    );

    const skeletonContent =
      !ticketsCount &&
      !isFinished &&
      [...Array(4)].map((_, index) => (
        <Skeleton
          type="ticket"
          key={index.toString() + 'internationalFlightSearch'}
          rtl
          uniqueKey="0"
          className={skeletonStyles['skeleton__tickets']}
        />
      ));

    const resultContent = Boolean(ticketsCount) && (
      <div>
        <Tickets
          tickets={filteredTicketsData}
          localData={localData}
          setLocalData={setLocalData}
          isLoading={isTicketsFetching}
          isMobile={true}
          requestId={requestIdData?.requestId ?? ''}
        />
      </div>
    );

    const filterEmptyResultContent = Boolean(ticketsCount) &&
      !Boolean(filteredTicketsCount) &&
      isFinished && (
        <EmptyResult
          className="m-5"
          type="filter"
          isMobile={false}
          handleClick={handleRemoveTicketsFilterClick}
        />
      );

    const searchEmptyResultContent = !Boolean(ticketsCount) && isFinished && (
      <EmptyResult handleClick={prepareRequestHandler} className="mt-3" type="search" />
    );

    return (
      <>
        {headerContent}
        <div className="col-12">
          {controlContent}
          <div className="my-3">
            {loadingContent}
            {skeletonContent}
          </div>
          {resultContent}
          {filterEmptyResultContent}
          {searchEmptyResultContent}
        </div>
      </>
    );
  };

  const hasNoResult = !Boolean(ticketsCount) && isFinished;
  const hasResult = Boolean(ticketsCount) && isFinished;

  const renderDesktopContent = () => {
    const resultContent =
      !isLoginCall ||
      (Boolean(ticketsCount) && Boolean(filteredTicketsCount) && (
        <>
          {fullCapacity && isFinished && (
            <div className={style['fullcapacity']}>
              <InfoIcon className={'fill-brown ms-1'} />
              موجودی پرواز‌ها در این تاریخ به اتمام رسیده است.
            </div>
          )}
          <Tickets
            localData={localData}
            setLocalData={setLocalData}
            tickets={filteredTicketsData}
            isLoading={isTicketsFetching}
            isMobile={false}
            requestId={requestIdData?.requestId ?? ''}
          />
        </>
      ));

    return (
      <>
        {!isFinished && (
          <div className="my-3">
            <div className="row justify-content-md-center">
              <div className="col-2">
                <Player src={intFlightLottie} className="player" loop autoplay />
              </div>
            </div>

            <div
              className="d-flex justify-content-center p-3"
              dangerouslySetInnerHTML={{
                __html: requestIdData?.loadingMessage || '',
              }}
            ></div>
          </div>
        )}
        {query.tripMode === '1' && (
          <AvailableDates hidden={!isFinished} disable={isTicketsFetching || loadingPrepare} />
        )}
        {hasResult && <SortTicket device={device!} ref={desktopTicketsSorterRef} />}
        <div className="d-flex flex-row gap-4">
          {hasNoResult && (
            <div className="m-auto">
              <EmptyResult className="m-5" type="search" />
            </div>
          )}
          {!hasNoResult && (
            <div className="col-9">
              {!isFinished && (
                <Skeleton
                  type="sort"
                  rtl
                  uniqueKey="sort"
                  className="bg-color-white p-2 mb-3"
                  height="50"
                  width="100%"
                />
              )}

              {Boolean(ticketsCount) && (
                <>
                  {resultContent}
                  {!Boolean(filteredTicketsCount) && (
                    <EmptyResult
                      className="m-5"
                      type="filter"
                      isMobile={false}
                      handleClick={handleRemoveTicketsFilterClick}
                    />
                  )}
                </>
              )}
              {!ticketsCount &&
                !isFinished &&
                [...Array(6)].map((item, index) => (
                  <Skeleton
                    type="ticket"
                    key={index.toString() + 'internationalFlightSearchSkeleton'}
                    rtl
                    uniqueKey="ticket"
                    className={skeletonStyles['skeleton__tickets']}
                  />
                ))}
            </div>
          )}
          {!hasNoResult && (
            <div className="col-3">
              {hasResult && (
                <>
                  <div className={style['desktop-filters-header']}>
                    <div className={style['title']}>فیلتر بر اساس</div>
                    {!isEqual(ticketsFilterState, initTicketsFilterState) && (
                      <button
                        className={style['remove-filters']}
                        onClick={handleDesktopRemoveTicketsFilterClick}
                      >
                        حذف فیلترها
                      </button>
                    )}
                  </div>
                  <TicketsFilterChips
                    state={toFilterChipsState(ticketsFilterState)}
                    onChange={(e) => {
                      handleTicketsFilterChipsChange(e);
                    }}
                  />
                  <TicketsFilter
                    state={ticketsFilterState}
                    onChange={(e) => {
                      handleDesktopTicketsFilterChange(e);
                    }}
                  />
                </>
              )}
              {!isFinished && (
                <Skeleton
                  type="filter"
                  rtl
                  uniqueKey="filter"
                  className="bg-color-white h-100 p-2"
                  height="100%"
                  width="100%"
                />
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  return device === Device.mobile ? renderMobileContent() : renderDesktopContent();
};
