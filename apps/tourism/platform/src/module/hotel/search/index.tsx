import React, { useEffect, useMemo, useState } from 'react';
import { Device } from 'utils/interface';
import HeaderHoc from 'components/headerHoc';
import { useRouter } from 'next/router';
import Skeleton from 'components/skeleton';
import skeletonStyles from 'components/skeleton/skeleton.module.scss';
import { ParsedUrlQuery } from 'querystring';
import { checkQueryDiff } from './helper';
import { useSearchQueryContext } from 'utils/hooks/useSearchQueryContext';
import ProgressBar from 'components/progressBar';
import { usePrepareRequestHandler } from './hooks/usePrepareRequestHandler';
import {
  TGetHotelSearchIdResponse,
  THotelInfo,
  THotelList,
} from 'services/hotel/prepare/interface';
import { useGetHotels } from './hooks/useGetHotels';
import { SearchHistory } from '../ticketsSearchBox/interface';
import styles from './style.module.scss';
import { useGetSearchValues } from './hooks/useGetSearchValues';
import classNames from 'classnames';
import { FilterIcon, SearchIcon } from 'assets/icons';
import { HotelCardView } from '../cardView';
import SortTicket from '../cardView/components/sortTicket';
import { filterCards } from '../cardView/filterCards';
import { isEqual } from 'lodash';
import { TicketsFilterChips } from 'containers/ticketsFilterChips';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { TicketsFilter } from 'containers/ticketsFilter';
import Button from '../../../components/button';
import { useHandleFilter } from '../cardView/components/hooks/useHandleFilter';
import { useInitTicketsFilterState } from '../cardView/components/hooks/useInitlTicketsFilterState';
import EmptyResult from 'components/emptyResult';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { removeCookie, setCookie } from 'utils/helpers/coockieHelper';
import { createTicketsFilterState, totalSelectedFilters } from 'containers/ticketsFilter/utils';
import { QueryType } from 'utils/helpers/global';
import { usePriceMinMax } from '../cardView/components/hooks/usePriceMinMax';
import { useGetFacility } from '../cardView/components/hooks/useGetFacility';
import AvailableDates from '../../../containers/availableDate';
import { useGetLotties } from 'module/general/config/hooks/useGetLotties';
import { CardViewDesktop } from 'module/hotel/cardViewDesktop';
import { useDispatch } from 'react-redux';
import { setHotelPassengersLength } from 'store/slices/ecommerce/ecomerceSlice';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { passengerCounter } from 'utils/ecommerce/application/mappers/hotel/helper';
import dynamic from 'next/dynamic';
import { HotelSuggestion } from '../suggestion';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);
interface Props {
  device: Device;
  isLoginCall: boolean;
}

const SearchHotel = ({ device, isLoginCall }: Props) => {
  const { query } = useRouter();
  const router = useRouter();
  const { checkExpiry } = useExpireContext();
  const { hotelLottie } = useGetLotties();
  // @ts-ignore
  const { setQueryState } = useSearchQueryContext();
  const [path, setPath] = useState<ParsedUrlQuery | null>(null);
  const [searchValue, setSearchValue] = useState<null | SearchHistory>(null);
  const dispatch = useDispatch();

  const { prepareRequestHandler, requestIdData, loadingPrepare } = usePrepareRequestHandler();

  const { hotelsData, isHotelsFetching, coveragePercent, getHotelListError } = useGetHotels(
    requestIdData as TGetHotelSearchIdResponse,
  );

  const filteredHotelsData = useMemo(() => {
    if (!hotelsData?.list) return [];
    if (!hotelsData?.list?.length) return [];

    return filterCards(JSON.parse(JSON.stringify(hotelsData?.list)), query);
  }, [query, hotelsData]);

  const {
    handleTicketsFilterIconClick,
    handleTicketsFilterChange,
    handleTicketsFilterChipsChange,
    handleTicketsFilterSubmit,
    handleRemoveTicketsFilterClick,
    bottomSheetIsVisible,
    bottomSheetSubmitted,
    setBottomSheetIsVisible,
    ticketsFilterState,
    setTicketsFilterState,
    ticketsFilterStateBeforeBottomSheetOpen,
    handleDesktopTicketsFilterChange,
    handleDesktopRemoveTicketsFilterClick,
  } = useHandleFilter(hotelsData?.list as THotelList);

  const { initTicketsFilterState } = useInitTicketsFilterState(hotelsData?.list as THotelList);

  const { priceMinMax } = usePriceMinMax(hotelsData?.list);
  const { facilities } = useGetFacility(hotelsData?.list);

  useEffect(() => {
    setTicketsFilterState(createTicketsFilterState(query as QueryType, initTicketsFilterState));
  }, [facilities, priceMinMax]);

  useEffect(() => {
    bottomSheetIsVisible
      ? (ticketsFilterStateBeforeBottomSheetOpen.current = ticketsFilterState)
      : !bottomSheetSubmitted.current
        ? setTicketsFilterState(ticketsFilterStateBeforeBottomSheetOpen.current)
        : (bottomSheetSubmitted.current = false);
  }, [bottomSheetIsVisible]);

  useEffect(() => {
    // localStorage.setItem('search-query', JSON.stringify(query));
    setQueryState(query);
  }, []);

  useEffect(() => {
    const last_search = JSON.parse(localStorage?.getItem('hotel_last_search') as string)?.[0];
    if (last_search) setSearchValue(last_search);
  }, [query]);

  useEffect(() => {
    setPath(query);
    const isQueryChanged = checkQueryDiff(query, path);
    if (!path || isQueryChanged) prepareRequestHandler();
  }, [query]);

  const {
    destination,
    duration,
    stayDate,
    passengerString,
    passengersCount,
    adultConut,
    roomsCount,
  } = useGetSearchValues(searchValue);
  useEffect(() => {
    if (typeof adultConut === 'number' && adultConut > 0) {
      const passenger = {
        earlyEntry: false,
        lateExit: false,
        extraBed: false,
        nationalId: '',
        persianFamily: '',
        persianName: '',
        phoneNumber: '',
      };
      const passengers = Array(adultConut).fill(passenger);
      localStorage.setItem('hotelPassengers', JSON.stringify(passengers));
    }
  }, [adultConut]);
  const handleEmptyResultClick = () => {
    router.push('/hotel');
  };

  useEffect(() => {
    if (requestIdData?.requestId) {
      removeCookie('uuid');
      setCookie('uuid', requestIdData.requestId, Number(requestIdData.expireTime));
      const currentDate = new Date().getTime();
      localStorage.setItem(
        'uuid-expiry',
        JSON.stringify(currentDate + Number(requestIdData?.expireTime) * 1000),
      );

      const timeout = setTimeout(
        () => checkExpiry({ type: 'uuid', expired: true }),
        Number(requestIdData?.expireTime) * 1000,
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [hotelsData, requestIdData]);

  useEffect(() => {
    const activeElement = document.getElementById('scrollItem');
    if (activeElement) {
      setTimeout(() => {
        activeElement.scrollIntoView({
          inline: 'center',
          behavior: 'smooth',
        });
      }, 2000);
    }
  }, [hotelsData?.isFinished]);

  useEffect(() => {
    if (filteredHotelsData.length) {
      const hotelEvent = new HotelTrackingEvent();
      const passengerQuantity =
        passengerCounter(router?.query).Adult + passengerCounter(router?.query).Child;

      const hotelModel: hotelViewListItemModel = {
        data: filteredHotelsData,
        query: query,
        quantity: passengerQuantity,
      };

      dispatch(
        setHotelPassengersLength({
          data: passengerQuantity,
        }),
      );
      hotelEvent.viewItemList(hotelModel);
    }
  }, [filteredHotelsData]);
  return device === Device.mobile ? (
    <>
      <HeaderHoc>
        <span className="text-3 text-weight-500">{destination}</span>
      </HeaderHoc>
      {hotelsData?.isFinished && !isHotelsFetching && !loadingPrepare && (
        <div className={styles['hotels__topSection']}>
          <div className={classNames(styles['hotels__changeSearch'], 'align-items-center')}>
            <div className={classNames(styles['hotels__changeSearch__icon'], 'col-2')}>
              <div onClick={() => router.push('/hotel')}>
                <SearchIcon className="fill-primary" />
              </div>
            </div>
            <div className="col-10">
              <div className={styles['hotels__changeSearch__date']}>{stayDate}</div>
              <div className={styles['hotels__changeSearch__passengers']}>
                {`${requestIdData?.nights} شب ،${passengerString} ،${roomsCount} اتاق`}
              </div>
            </div>
          </div>
          <div className={styles['hotels__changeSearch__divider']} />
          <div className="col-12">
            {!getHotelListError &&
              (!!filteredHotelsData?.length ||
                !isEqual(ticketsFilterState, initTicketsFilterState)) && (
                <div className={styles['mobile-sticky-utilities']}>
                  <div
                    className={classNames(
                      styles['filter-button'],
                      totalSelectedFilters(ticketsFilterState) && styles['active'],
                    )}
                    onClick={handleTicketsFilterIconClick}
                  >
                    <div className={styles['main']}>
                      {!!totalSelectedFilters(ticketsFilterState) && (
                        <div className={styles['filters-number']}>
                          {totalSelectedFilters(ticketsFilterState)}
                        </div>
                      )}
                      <FilterIcon />
                    </div>
                  </div>
                  <div className={styles['mobile-sticky-chips']}>
                    {/* DO NOT DELETE COMMENT: */}
                    {/* <TicketsFilterChips
                      state={ticketsFilterState}
                      onChange={e => {
                        handleTicketsFilterChipsChange(e);
                      }}
                    /> */}
                    {!!filteredHotelsData?.length && <SortTicket device={device!} />}
                  </div>
                  <BottomSheet
                    open={bottomSheetIsVisible}
                    onDismiss={() => {
                      setBottomSheetIsVisible(false);
                    }}
                    snapPoints={({ maxHeight }) => maxHeight * 0.9}
                  >
                    <div className={styles['mobile-tickets-filter']}>
                      <div className={styles['header']}>
                        <div className={styles['title']}>فیلتر نتایج</div>
                        <button
                          className={styles['remove-filters']}
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
                        className={classNames(
                          styles['submit-button'],
                          'btn-primary position-absolute',
                        )}
                        onClick={handleTicketsFilterSubmit}
                      >
                        اعمال فیلترها
                      </Button>
                    </div>
                  </BottomSheet>
                </div>
              )}
          </div>
        </div>
      )}
      <div className="col-12">
        {(!hotelsData?.isFinished || isHotelsFetching || loadingPrepare) && !getHotelListError && (
          <div className="col-12  d-flex flex-column align-items-center mt-2">
            <div className="col-9">
              <Player src={hotelLottie} className="player" loop autoplay />
              <div
                className="d-flex justify-content-center text-center py-3"
                dangerouslySetInnerHTML={{
                  __html: requestIdData?.loadingMessage || '',
                }}
              ></div>
              <div className="row justify-content-center mb-3">
                <div className="col">
                  <ProgressBar percent={coveragePercent} customClass={'bg-color-primary'} />
                </div>
              </div>
            </div>
            <div>
              {[...Array(2)].map((_, index) => (
                <Skeleton
                  type="hotel"
                  key={index.toString() + 'hotelSearch'}
                  rtl
                  uniqueKey="0"
                  className={skeletonStyles['skeleton__hotel']}
                />
              ))}
            </div>
          </div>
        )}{' '}
        <div className={styles['hotels__bottomSection']}>
          {hotelsData?.isFinished &&
            !isHotelsFetching &&
            !loadingPrepare &&
            (filteredHotelsData.length > 0 ? (
              <>
                <span className="text-3 black-1 d-block text-end mb-2 text-weight-400">
                  هتل خود را انتخاب نمایید
                </span>
                {hotelsData?.suggestions && (
                  <HotelSuggestion
                    requestId={requestIdData?.requestId || ''}
                    isDesktop={false}
                    suggestions={hotelsData?.suggestions}
                  />
                )}
                <HotelCardView
                  hotels={filteredHotelsData}
                  isMobile={true}
                  duration={requestIdData?.nights ? requestIdData.nights : duration}
                  requestId={requestIdData?.requestId}
                />
              </>
            ) : null)}
        </div>
        {hotelsData?.isFinished &&
        hotelsData?.list &&
        hotelsData.list.length > 0 &&
        filteredHotelsData.length === 0 ? (
          <EmptyResult
            className="m-5"
            type="hotel-filter"
            handleClick={handleDesktopRemoveTicketsFilterClick}
          />
        ) : null}
        {hotelsData?.isFinished && !hotelsData?.list?.length && (
          <div className={classNames(styles['hotels__bottomSection'], 'pt-5 px-5')}>
            <EmptyResult
              // handleClick={handleEmptyResultClick}
              className="mt-3"
              type="hotel search result - empty"
            />
          </div>
        )}
        {getHotelListError && (
          <div className="pt-5 px-5">
            <EmptyResult
              handleClick={handleEmptyResultClick}
              className="mt-3"
              type="hotel search result - connection error"
            />
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      {!hotelsData?.isFinished || isHotelsFetching || loadingPrepare ? (
        <div className="my-3">
          <div className="row justify-content-md-center">
            <div className="col-2 mt-5" id="scrollItem">
              <Player src={hotelLottie} className="player" loop autoplay />
            </div>
          </div>
          <div
            className="d-flex justify-content-center p-3"
            dangerouslySetInnerHTML={{
              __html: requestIdData?.loadingMessage || '',
            }}
          ></div>
          <div className="row rtl ">
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
              <div className="text-weight-500 text-5 rtl mb-2">
                {' '}
                جستجو هتل {destination}
                <span className="color-red-2 text-3 text-weight-500">
                  {' '}
                  {`${requestIdData?.nights} شب ،${passengersCount} نفر , ${roomsCount} اتاق`}
                </span>
              </div>
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
                  key={index.toString() + 'hotelSearch2'}
                  rtl
                  uniqueKey="ticket"
                  className={skeletonStyles['skeleton__tickets']}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row d-flex">
            {query.tripMode === '1' && (
              <AvailableDates disable={isHotelsFetching || loadingPrepare} />
            )}
            {hotelsData?.isFinished && !isHotelsFetching && (hotelsData?.list as []).length > 0 ? (
              <SortTicket device={device!} />
            ) : null}
            <div className="col-9 pb-2">
              {!isLoginCall || hotelsData?.list?.length ? (
                filteredHotelsData?.length ? (
                  <div>
                    <div className="text-weight-500 text-5 rtl mb-2">
                      {' '}
                      جستجو هتل {destination}
                      <span className="color-red-2 text-3 text-weight-500">
                        {' '}
                        {`${requestIdData?.nights} شب ،${passengersCount} نفر , ${roomsCount} اتاق`}
                      </span>
                    </div>
                    <div>
                      {hotelsData?.suggestions && (
                        <HotelSuggestion
                          requestId={requestIdData?.requestId || ''}
                          isDesktop={true}
                          suggestions={hotelsData?.suggestions}
                        />
                      )}
                    </div>
                    {filteredHotelsData?.map((ele: THotelInfo, index) => {
                      return (
                        <CardViewDesktop
                          uuid={ele.uniqueId as string}
                          key={index.toString() + 'searchInHotel'}
                          id={index}
                          hotels={ele}
                          isMobile={false}
                          duration={requestIdData?.nights ? requestIdData.nights : duration}
                          requestId={requestIdData?.requestId}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyResult
                    className="m-5"
                    type="hotel-filter"
                    handleClick={handleDesktopRemoveTicketsFilterClick}
                  />
                )
              ) : null}
            </div>
            {hotelsData?.list?.length === 0 ? (
              <div>
                {' '}
                <div className="col-8 pb-2 m-auto">
                  <EmptyResult className="m-5" type="hotel search result - empty" />
                </div>
              </div>
            ) : null}
            {(hotelsData?.list as []).length > 0 ? (
              <div className="col-3 ">
                <div className="px-3 pt-3">
                  {!!ticketsFilterState.length && (
                    <div className={styles['desktop-filters-header']}>
                      <div className={styles['title']}>:فیلتر بر اساس</div>
                      {!isEqual(ticketsFilterState, initTicketsFilterState) && (
                        <button
                          className={styles['remove-filters']}
                          onClick={handleDesktopRemoveTicketsFilterClick}
                        >
                          حذف همه
                        </button>
                      )}
                    </div>
                  )}
                  <div className={styles['desktop-filters-border']}>
                    <TicketsFilterChips
                      length={filteredHotelsData.length}
                      state={ticketsFilterState}
                      onChange={(e) => {
                        handleTicketsFilterChipsChange(e);
                      }}
                    />
                  </div>
                </div>
                <TicketsFilter
                  state={ticketsFilterState}
                  onChange={(e) => {
                    handleDesktopTicketsFilterChange(e);
                  }}
                />
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default SearchHotel;
