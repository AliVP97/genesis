import React, { useEffect, useState, useRef, useMemo } from 'react';
import Tickets from 'module/flights/tickets';
import styles from 'containers/filter/filterTicket/filterTicket.module.scss';
import { FilterIcon, InfoFillIcon } from 'assets/icons';
import cn from 'classnames';
import Chips from 'containers/filter/filterChips';
import SortTicket from 'module/flights/tickets/ticket/sortTicket';
import { BottomSheet } from 'react-spring-bottom-sheet';
import FilterTicket from 'containers/filter/filterTicket';
import { Device } from 'utils/interface';
import EmptyResult from 'components/emptyResult';
import { TicketList } from 'module/flights/tickets/ticket/interface';
import HeaderHoc from 'components/headerHoc';
import { useRouter } from 'next/router';
import AvailableDates from 'containers/availableDate';
import { removeCookie, setCookie } from 'utils/helpers/coockieHelper';
import { SearchHistory } from 'module/flights/tickets/ticket/searchTicket/interface';
import Skeleton from 'components/skeleton';
import skeletonStyles from 'components/skeleton/skeleton.module.scss';
import classNames from 'classnames';
import SelectedTicket from 'module/flights/tickets/ticket/selectedTicket';
import { ParsedUrlQuery } from 'querystring';
import { checkQueryDiff } from './helper';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import Drawer from 'containers/drawer';
import { useSearchQueryContext } from 'utils/hooks/useSearchQueryContext';
import useDetectBreakPoint from 'utils/hooks/useDetectBreakPoint';
import ProgressBar from 'components/progressBar';
import { usePrepareRequestHandler } from './hooks/usePrepareRequestHandler';
import { useGetTickets } from './hooks/useGetTickets';
import { GetDomesticTicketResponse, GetSearchIdResponse } from 'services/domestic/flight/interface';
import { useGetAirlines } from './hooks/useGetAirlines';
import { useHandleFilter } from './hooks/useHandleFilter';
import { useSelectTicket } from './hooks/useSelectTicket';
import style from './style.module.scss';
import { useAvailableDatesContents } from './hooks/useAvailableDatesContents';
import { isEqual } from 'lodash';
import { LetMeKnow } from './components/LetMeKnow';
import flightAnimation from 'public/animations/flight-loading-search.json';
import { iataToFarsi } from 'utils/static/flightStatics';
import SuggestionFlights from './components/Suggestion/suggestion-3rd/suggestion-flights';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { useDispatch, useSelector } from 'react-redux';
import { domesticFlight } from 'store/slices/ecommerce/ecomerceSlice';
import { resetFilters } from 'utils/helpers/resetFilters';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { RootState } from 'store';
import _ from 'lodash';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

interface Props {
  device: Device;
  isLoginCall: boolean;
  lastSearch?: SearchHistory;
}

interface OptionalQueryParams {
  tripType?: string;
  returningDate?: string;
}

const SearchFlight = ({ device, isLoginCall, lastSearch }: Props) => {
  const isSuperApp = useIsSuperApp();
  const { uuidExpired, checkExpiry } = useExpireContext();
  const { query, push } = useRouter();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const staticFilters = {
    toward: undefined,
    backward: undefined,
    price: undefined,
    airlines: undefined,
    ticketType: undefined,
    flightClass: undefined,
  };
  const filterComponent = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const expireModalInitialValue = useRef(false);
  // @ts-ignore
  const { setQueryState } = useSearchQueryContext();
  const [locations, setLocations] = useState<null | SearchHistory>(null);
  const [path, setPath] = useState<ParsedUrlQuery | null>(null);
  const [expand, setExpand] = useState(false);
  const [hasAlert, setHasAlert] = useState<[boolean] | [boolean, boolean]>([false]);
  const [ticketsWithSeats, setTicketsWithSeats] = useState<TicketList>([]);
  const [ticketsWithoutSeats, setTicketsWithoutSeats] = useState<TicketList>([]);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const { breakPoint } = useDetectBreakPoint();
  const { prepareRequestHandler, requestIdData, loadingPrepare } =
    usePrepareRequestHandler(isLoginCall);
  const { handleChangeTowardTicket, selectedTicketDeparture, setSelectedTicketDeparture } =
    useSelectedTicket();

  // When the expired modal appears, the following code will be called to run prepare api
  useEffect(() => {
    if (!expireModalInitialValue.current) {
      expireModalInitialValue.current = true;
      return;
    }
    prepareRequestHandler();
  }, [query.expired]);

  const { ticketsData, isTicketsLoading, isTicketsFetching } = useGetTickets(
    requestIdData as GetSearchIdResponse,
  );
  const {
    handleSelectTicket,
    selected,
    setSelected,
    changedDepartureDateBySuggestion,
    setChangedDepartureDateBySuggestion,
  } = useSelectTicket();
  const { airlines } = useGetAirlines(selected, ticketsData as GetDomesticTicketResponse);
  const {
    minMax,
    filtersLength,
    removeFilter,
    handleUpdate,
    updateQuery,
    tempFilter,
    setTempFilter,
    filteredTickets,
    data,
    isUnavailable,
    showFullCapacityBanner,
    suggestionCondition,
  } = useHandleFilter(ticketsData as GetDomesticTicketResponse, device, selected);

  //Reset all filters when selected departure ticket is selected on the tripType flight, then refresh the page
  useEffect(() => {
    const queryString: string | null = localStorage.getItem('search-query');
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (queryString) {
      const parsedQueryString: OptionalQueryParams = JSON.parse(queryString);

      if (parsedQueryString?.tripType && parsedQueryString?.returningDate) {
        // Define allowed keys
        const allowedKeys = [
          'adult',
          'child',
          'departureDate',
          'id',
          'infant',
          'returningDate',
          'sort',
        ];

        // Filter the queryString to retain only the allowed keys
        const filteredQuery = Object.fromEntries(
          Object.entries(parsedQueryString).filter(([key]) => allowedKeys.includes(key)),
        );

        timeout = setTimeout(() => {
          resetFilters(filteredQuery, push);
        }, 200);
      }
    }

    // Cleanup function
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  //when the user routes from checkout/passenger page to change the returning ticket
  useEffect(() => {
    if (selectedTicketDeparture) {
      setSelected(selectedTicketDeparture);
    }
  }, []);

  // when a departure ticket clicked, selectedTicketDeparture on context gets null not to destroy above useEffect to show the departure ticket when gets back just from checkout/passenger pages
  useEffect(() => {
    if (!!selected) {
      setSelectedTicketDeparture({ selectedTicketDeparture: null });
    }
  }, [selected]);

  useEffect(() => {
    localStorage.setItem('search-query', JSON.stringify(query));
    if (!query?.returningDate) setSelected(null);
    setQueryState(query);
  }, [query]);

  //check if the departure date has changed by suggestion flight ticket, the selected ticket won't be null
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!changedDepartureDateBySuggestion) {
      setSelected(null);
    }
    setChangedDepartureDateBySuggestion(false);
  }, [query.departureDate, query.id]);

  const currentQuery = useRef(query);

  // when prepare api wants to get called a couple of times by changing the URl, the last one only will be called, thanks to debounceTimeout.
  useEffect(() => {
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    const runEffect = () => {
      setPath(query);
      const isQueryChanged = checkQueryDiff(query, path);
      if (!path || isQueryChanged) prepareRequestHandler();

      if (!isEqual(query, currentQuery.current)) {
        currentQuery.current = query;
      }
    };

    debounceTimeout = setTimeout(runEffect, 300);
    return () => clearTimeout(debounceTimeout!);
  }, [query]);

  useEffect(() => {
    if (requestIdData?.requestID) {
      removeCookie('uuid');
      setCookie('uuid', requestIdData.requestID, requestIdData.validForSeconds as number);
      const currentDate = new Date().getTime();
      localStorage.setItem(
        'uuid-expiry',
        JSON.stringify(currentDate + (requestIdData?.validForSeconds as number) * 1000),
      );
      const timeout = setTimeout(
        () => checkExpiry({ type: 'uuid', expired: true }),
        (requestIdData?.validForSeconds as number) * 1000,
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [ticketsData, requestIdData]);

  useEffect(() => {
    const last_search =
      lastSearch || JSON.parse(localStorage?.getItem('last_search') as string)?.[0];
    if (last_search) setLocations(last_search);
  }, [query.id]);

  const availableDatesContents = useAvailableDatesContents(
    ticketsData,
    selected ? 'returning' : 'departure',
  );

  const topSectionRef = useRef<HTMLDivElement>(null);
  const [topSectionHeight, setTopSectionHeight] = useState<number | undefined>();
  useEffect(() => {
    setTopSectionHeight(topSectionRef.current?.clientHeight);
  }, [
    ticketsData,
    isTicketsFetching,
    loadingPrepare,
    isLoginCall,
    filteredTickets,
    selected,
    availableDatesContents,
    showTicketDetail,
  ]);

  //the result of tickets, separating the full capacity and available tickets to use only on desktop
  useEffect(() => {
    const ticketsWithSeat: TicketList = [];
    const ticketsWithoutSeat: TicketList = [];
    filteredTickets.forEach((ticket) => {
      if (ticket.remainingSeats && ticket.remainingSeats > 0) {
        ticketsWithSeat.push(ticket);
      } else {
        ticketsWithoutSeat.push(ticket);
      }
    });
    setTicketsWithSeats(ticketsWithSeat);
    setTicketsWithoutSeats(ticketsWithoutSeat);
  }, [filteredTickets, query.sort]);

  const filterIsSet: boolean =
    !!filteredTickets[0] || filtersLength !== 0 || !ticketsData?.finished;
  useEffect(() => {
    !isTicketsFetching &&
      ticketsData &&
      setHasAlert(
        ticketsData?.flightQueryResult?.map(({ alert }) => alert) as [boolean] | [boolean, boolean],
      );
  }, [isTicketsFetching, ticketsData]);

  const ticketComponent = useMemo(() => {
    const Component = (ticketCapacity: TicketList, mobileState = false) => (
      <Tickets
        oneWay={!query.returningDate}
        returning={!!selected}
        onSelectTicket={handleSelectTicket}
        tickets={ticketCapacity}
        isLoading={isTicketsLoading}
        isReturn={!!selected}
        isMobile={mobileState}
      />
    );

    Component.displayName = 'TicketComponent'; // Set display name

    return Component;
  }, [query.returningDate, selected, handleSelectTicket]);

  const locationsTitle = useMemo(() => {
    if (!query.id) return '';
    const [firstCity, secondCity] = query.id.toString().split('-');
    if (!iataToFarsi?.[firstCity] || !iataToFarsi?.[secondCity]) return '';
    return selected
      ? `${iataToFarsi?.[secondCity]} به ${iataToFarsi?.[firstCity]}`
      : `${iataToFarsi?.[firstCity]} به ${iataToFarsi?.[secondCity]}`;
  }, [query.id, selected]);

  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );

  useEffect(() => {
    if (ticketsData?.finished) {
      const domesticFlightTracking = new DomesticFlightTrackingEvent();
      const ecomerceEventFlightdata: propsModel = {
        ticketsData: filteredTickets,
        query: query,
        locations: locations,
      };
      if (!_.isEqual(ecomerceEventFlightdata, domesticFlightData)) {
        domesticFlightTracking.viewItemList(ecomerceEventFlightdata);
      }
      dispatch(
        domesticFlight({
          flights: ecomerceEventFlightdata,
        }),
      );
    }
  }, [filteredTickets]);

  const startDate = selected ? query.departureDate : undefined;

  const chipClassName = isUnavailable
    ? cn(style['fullcapacity__chip'], style['no-flight'])
    : style['fullcapacity__chip'];

  const chipContent = isUnavailable ? (
    <>
      <InfoFillIcon />
      متاسفانه، هیچ پروازی در این روز وجود ندارد.
    </>
  ) : (
    <>
      <InfoFillIcon />
      متاسفانه، ظرفیت تمام پروازها در این روز به اتمام رسیده است.
    </>
  );

  const renderReturnFlightMessage = (mobileRender = true) => {
    if (!!ticketsWithSeats.length && selected) {
      return (
        <span className={`"black-1 d-block text-end mb-2" ${mobileRender ? 'text-2' : 'text-4'}`}>
          پرواز برگشت را از <strong>{locations?.destination?.city}</strong> به{' '}
          <strong>{locations?.origin?.city}</strong> انتخاب کنید
        </span>
      );
    }

    if (ticketsData?.finished && !!ticketsWithSeats.length) {
      return (
        <span
          className={`"black-1 d-block text-end mb-2 rtl" ${mobileRender ? 'text-2' : 'text-4'}`}
        >
          {ticketsData.flightQueryResult
            ? ticketsData.flightQueryResult.length > 1
              ? 'پرواز رفت را انتخاب کنید'
              : '.لطفا بلیط خود را انتخاب کنید'
            : undefined}
        </span>
      );
    }

    return null;
  };

  const renderTickets = (mobileRender = true) => (
    <>
      {!!ticketsWithSeats.length && ticketComponent(ticketsWithSeats, mobileRender)}
      {!!ticketsWithoutSeats.length && (
        <>
          <span
            className={`text-weight-500 black-1 d-block text-end mb-2 rtl ${
              mobileRender ? 'text-3' : 'text-5'
            }`}
          >
            پروازهای تکمیل ظرفیت
          </span>
          {ticketComponent(ticketsWithoutSeats, mobileRender)}
        </>
      )}
    </>
  );

  const renderSkeletons = (arrayNumber: number) => (
    <div>
      {[...Array(arrayNumber)].map((_, index) => (
        <Skeleton
          type="ticket"
          key={`${index}-flightsSearch`}
          rtl
          uniqueKey="ticket"
          className={skeletonStyles['skeleton__tickets']}
        />
      ))}
    </div>
  );

  const renderEmptyResult = (mobileRender = true) =>
    filtersLength !== 0 && (
      <div className={`${!mobileRender && 'pb-2 m-auto col-6'}`}>
        <EmptyResult
          handleClick={() => {
            updateQuery(staticFilters);
            setTempFilter(staticFilters);
          }}
          className={`${mobileRender ? 'mt-3' : 'm-5'}`}
          type="filter"
          isMobile={mobileRender}
        />
      </div>
    );

  const isReadyToDisplay = !(!ticketsData?.finished || isTicketsFetching || loadingPrepare);
  const noFlightsAvailableMessage = isUnavailable
    ? 'متاسفانه، هیچ پروازی در این روز وجود ندارد.'
    : 'متاسفانه، ظرفیت تمام پروازها در این روز به اتمام رسیده است.';

  const renderNoFlightsMessage = () => (
    <div className={style['fullcapacity']}>
      <div
        className={
          isUnavailable
            ? cn(style['fullcapacity__chip'], style['no-flight'])
            : style['fullcapacity__chip']
        }
      >
        <InfoFillIcon />
        {noFlightsAvailableMessage}
      </div>
    </div>
  );

  return device === Device.mobile ? (
    <div style={{ paddingTop: topSectionHeight }}>
      <HeaderHoc>
        <span className="text-3 text-weight-500">{locationsTitle}</span>
      </HeaderHoc>
      <div ref={topSectionRef} className={style['top-section']}>
        {selected && (
          <SelectedTicket
            selectedTicket={selected}
            handleChangeTowardTicket={() => {
              const { departureFlightId, ...restQuery } = query;
              void departureFlightId;
              handleChangeTowardTicket(restQuery, push);
              setSelected(null);
            }}
            onShowTicketDetails={(status) => setShowTicketDetail(status)}
            isMobile={true}
          />
        )}
        <div className={`${classNames('w-100')}`}>
          <AvailableDates
            returning={!!selected}
            disable={loadingPrepare}
            daysContents={availableDatesContents}
            startDate={startDate}
          />
        </div>

        {ticketsData?.finished &&
          !showFullCapacityBanner &&
          (filteredTickets[0] || filtersLength != 0) && (
            <>
              <div className={styles['filter__mobile-icon']}>
                <div className="d-flex" onClick={() => setVisible(true)}>
                  <span className={styles['filter__mobile-badge']}>
                    <FilterIcon />
                    {filtersLength !== 0 && (
                      <span className={styles['filter__mobile-badge-number']}>{filtersLength}</span>
                    )}
                  </span>
                </div>
                <div className={cn(styles['filter__mobile-chips'], 'd-flex ms-n3')}>
                  <Chips handleUpdate={removeFilter} airlinesList={airlines} />
                  <SortTicket device={device} />
                </div>
                <BottomSheet
                  blocking={!uuidExpired}
                  open={visible}
                  onDismiss={() => setVisible(!visible)}
                  skipInitialTransition
                  snapPoints={({ maxHeight }) => maxHeight * 0.9}
                >
                  <FilterTicket
                    filterLength={filtersLength}
                    returning={!!selected}
                    device={device}
                    priceLimit={minMax}
                    airlineList={airlines!}
                    updateQuery={updateQuery}
                    handleUpdate={handleUpdate}
                    tempFilter={tempFilter}
                    setTempFilter={setTempFilter}
                    submitFilter={() => {
                      updateQuery(tempFilter);
                      setVisible(false);
                    }}
                    removeFilter={removeFilter}
                    ticketLength={
                      ticketsData.flightQueryResult?.[Number(!!selected)]?.flightList?.length
                    }
                    filteredLength={filteredTickets.length}
                    ticketsWithSeats={!!ticketsWithSeats.length}
                  />
                </BottomSheet>
              </div>
            </>
          )}
      </div>
      {isReadyToDisplay && (
        <>
          {showFullCapacityBanner && (
            <div className={style['fullcapacity']}>
              <div className={chipClassName}>{chipContent}</div>
            </div>
          )}
          {!selected && hasAlert?.[0] && <LetMeKnow />}
          {selected && hasAlert?.[1] && <LetMeKnow returning={true} />}
          {suggestionCondition && (
            <SuggestionFlights
              oneWay={!query.returningDate}
              returning={!!selected}
              onSelectTicket={handleSelectTicket}
              tickets={data?.suggestion?.suggests as TicketList}
              isLoading={isTicketsLoading}
              isReturn={!!selected}
              isMobile={true}
            />
          )}
          {isUnavailable && <div className={style['no-flight-space']} />}
        </>
      )}

      <div className={`${isSuperApp && styles['is-superapp']} col-12 pt-3`}>
        {!isReadyToDisplay && (
          <div className="px-5 col-9 mx-auto">
            <Player src={flightAnimation} className="player" loop autoplay />
            <div
              className="d-flex justify-content-center text-center py-3"
              dangerouslySetInnerHTML={{
                __html: requestIdData?.loadingMessage || '',
              }}
            />
            <div className="row justify-content-center mb-3">
              <div className="col">
                <ProgressBar percent={ticketsData?.percent} customClass={'bg-color-primary'} />
              </div>
            </div>
          </div>
        )}

        {!isLoginCall || filteredTickets?.length ? (
          <>
            {renderReturnFlightMessage()}
            {renderTickets()}
          </>
        ) : !ticketsData?.finished ? (
          renderSkeletons(4)
        ) : (
          isReadyToDisplay && renderEmptyResult()
        )}
      </div>
    </div>
  ) : (
    <>
      {selected && (
        <SelectedTicket
          selectedTicket={selected}
          handleChangeTowardTicket={() => {
            const { departureFlightId, ...restQuery } = query;
            void departureFlightId;
            handleChangeTowardTicket(restQuery, push);
            setSelected(null);
          }}
          isMobile={false}
        />
      )}
      <AvailableDates
        returning={!!selected}
        disable={isTicketsFetching || loadingPrepare}
        daysContents={availableDatesContents}
        startDate={startDate}
      />
      {!isReadyToDisplay && (
        <div className="d-flex flex-column justify-content-center">
          <div className="row justify-content-center">
            <div className="col-2 mt-5">
              <Player src={flightAnimation} className="player" loop autoplay />
            </div>
          </div>
          <div
            className="d-flex justify-content-center text-center p-3"
            dangerouslySetInnerHTML={{
              __html: requestIdData?.loadingMessage || '',
            }}
          />

          <div className="row justify-content-center mb-3">
            <div className="col-4">
              <ProgressBar percent={ticketsData?.percent} customClass={'bg-color-primary'} />
            </div>
          </div>
        </div>
      )}
      <>
        <div className="col">
          <div className="row">
            <div className={`${filterIsSet ? 'col-xxl-9 col-xl-9 col-lg-9 col-12' : ''} col-md-12`}>
              {showFullCapacityBanner && isReadyToDisplay && renderNoFlightsMessage()}

              {ticketsData?.finished ? (
                <>
                  <div>
                    <div
                      className="d-flex"
                      onClick={() => setExpand(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={cn(styles['filter__mobile-badge'], styles['badge-hidden'])}>
                        <FilterIcon />
                        {filtersLength !== 0 && (
                          <span
                            className={cn(
                              styles['filter__mobile-badge-number'],
                              styles['badge-hidden'],
                            )}
                          >
                            {filtersLength}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className={cn(styles['filter__mobile-chips'], 'd-flex ms-n3')}>
                      <Chips
                        handleUpdate={removeFilter}
                        airlinesList={airlines}
                        className={'badge-hidden'}
                      />
                      {!!ticketsWithSeats.length && <SortTicket device={device} />}
                    </div>
                  </div>
                </>
              ) : (
                <Skeleton
                  type="sort"
                  rtl
                  uniqueKey="sort"
                  className="bg-color-white p-2 mb-3"
                  height="50"
                  width="100%"
                />
              )}

              {isReadyToDisplay && (
                <>
                  {!selected && hasAlert?.[0] && <LetMeKnow />}
                  {selected && hasAlert?.[1] && <LetMeKnow returning={true} />}
                  {suggestionCondition && (
                    <SuggestionFlights
                      oneWay={!query.returningDate}
                      returning={!!selected}
                      onSelectTicket={handleSelectTicket}
                      tickets={data?.suggestion?.suggests as TicketList}
                      isLoading={isTicketsLoading}
                      isReturn={!!selected}
                    />
                  )}
                </>
              )}

              {filteredTickets?.length ? (
                <>
                  {renderReturnFlightMessage(false)}
                  {renderTickets(false)}
                </>
              ) : !ticketsData?.finished ? (
                renderSkeletons(6)
              ) : (
                isReadyToDisplay && renderEmptyResult(false)
              )}
            </div>
            {!ticketsData?.finished ? (
              <div
                className={cn(
                  styles['filter-skeleton-box'],
                  'col-xxl-3 col-xl-3 col-md-3 col-lg-3 col-3',
                )}
              >
                <Skeleton
                  type="filter"
                  rtl
                  uniqueKey="filter"
                  className="bg-color-white h-100 p-2 d-block rounded"
                  height="100%"
                  width="100%"
                />
              </div>
            ) : (
              <>
                {(filteredTickets[0] || filtersLength != 0) &&
                  !(isTicketsLoading || loadingPrepare) && (
                    <div className={cn(styles['hidden'], 'col-3')} ref={filterComponent}>
                      <FilterTicket
                        filterLength={filtersLength}
                        returning={!!selected}
                        device={device}
                        priceLimit={minMax}
                        airlineList={airlines!}
                        updateQuery={updateQuery}
                        handleUpdate={handleUpdate}
                        tempFilter={tempFilter}
                        setTempFilter={setTempFilter}
                        removeFilter={removeFilter}
                        ticketLength={
                          ticketsData.flightQueryResult?.[Number(!!selected)]?.flightList?.length
                        }
                        filteredLength={filteredTickets.length}
                        ticketsWithSeats={!!ticketsWithSeats.length}
                      />
                    </div>
                  )}
              </>
            )}

            <div>
              <Drawer
                breakpoint={breakPoint}
                filterLength={filtersLength}
                returning={!!selected}
                device={device}
                priceLimit={minMax}
                airlineList={airlines!}
                updateQuery={updateQuery}
                handleUpdate={handleUpdate}
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                submitFilter={() => {
                  updateQuery(tempFilter);
                  setExpand(false);
                }}
                removeFilter={removeFilter}
                expand={expand}
                setExpand={setExpand}
              />
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default SearchFlight;
