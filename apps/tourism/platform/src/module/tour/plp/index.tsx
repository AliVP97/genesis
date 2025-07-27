import DesktopTourCardList from './components/desktopTourCardList';
import SortList from './components/sortList';
import FilterTour from './components/FilterTour';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { BottomSheet } from 'react-spring-bottom-sheet';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { FilterIcon } from 'assets/icons';
import { TransformedDataType } from './components/FilterTour/interface';
import { useMutation } from 'react-query';
import { searchItems } from 'services/tour/v2/search';
import { formatQueryObject } from './utils/queryStringGenerator';
import { useRouter } from 'next/router';
import Skeleton from 'components/skeleton';
import { definitions } from 'types/tour';
import cn from 'classnames';
import styles from './filters.module.scss';
import { useAppDispatch } from 'store/hook/storeHook';
import { scrollHandler } from 'store/slices/domestic-flights/mainPageScrollPlace';
import HeaderHoc from 'components/headerHoc';
import queryString from 'query-string';
import { NotFoundTour, NotFoundTourMobile } from 'assets/images';
import Button from 'components/button';
import { ErrorResponse } from 'components/passenger/components/addPassenger/addPassenger';

let DISPLAY_ITEMS: definitions['tourSearchResponseData'][] = [];
let FILTERS_DATA = {};

const TourPlpContainer = () => {
  const filtersRef = useRef<string>('');
  const mountingRenderRef = useRef<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pagination, setPagination] = useState<boolean>(false);
  const { query, push, pathname, asPath } = useRouter();
  const dispatch = useAppDispatch();
  const handlePageNumber = () => {
    dispatch(scrollHandler({ status: false }));
    setPagination(false);
    setPageNumber((prev) => prev + 1);
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // scroll of filtering is inactive in initial rendering
  useEffect(() => {
    if (mountingRenderRef.current) {
      dispatch(scrollHandler({ status: false }));
      setTimeout(() => {
        mountingRenderRef.current = false;
      }, 200);
    }
  }, []);
  const {
    mutate: searchItemsMutate,
    isLoading,
    data: searchData,
  } = useMutation({
    mutationFn: (filtersInputData: definitions['tourSearchRequest']) => {
      return searchItems(filtersInputData);
    },
    onSuccess: (data) => {
      if (data?.data?.length && data.data.length > 0) {
        DISPLAY_ITEMS.push(...data.data.flat());
      }
      if (data.pagination?.currentPage && data.pagination?.totalPage) {
        setPagination(data.pagination.currentPage < data.pagination.totalPage);
      }
    },
    onError: (error) => {
      if ((error as ErrorResponse)?.response?.data?.code === 404) {
        push('/404');
      }
    },
  });

  useEffect(() => {
    if (pageNumber === 1) {
      DISPLAY_ITEMS = [];
    }
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      let origin = '';
      let destination;
      if (query.id && (query.id as string).includes('-')) {
        const [originPart, destinationPart] = (query.id as string).split('-');
        origin = originPart;
        destination = destinationPart;
      } else {
        destination = query.id as string;
      }
      const adult = query?.adult ? String(query.adult) : undefined; // Ensure adult is a string or undefined
      // const children = query?.child ? query?.child?.split(',') : [];
      const children = typeof query?.child === 'string' ? query.child.split(',') : [];

      const filtersInputData = {
        origin: origin || undefined,
        destination: destination || undefined,
        passenger: {
          adult: adult,
          children: children,
        },
        filter: FILTERS_DATA || undefined,
        sortBy: Array.isArray(query?.sort) ? query.sort[0] : query?.sort || undefined,
        pageNumber: pageNumber || 1,
        type: (query?.type as string) || undefined,
      };

      searchItemsMutate(filtersInputData);
    }, 200);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [pathname, query, pageNumber]);

  const [visible, setVisible] = useState<boolean>(false);
  const { uuidExpired } = useExpireContext();
  const { isMobile } = useDeviceDetect();
  const handleFiltersData = useCallback(
    (filtersData: TransformedDataType) => {
      if (isMobile) {
        setVisible(false);
      }
      FILTERS_DATA = { ...filtersData };
      if (filtersRef.current !== JSON.stringify(FILTERS_DATA)) {
        if (!mountingRenderRef.current) {
          dispatch(scrollHandler({ status: true }));
        }
        filtersRef.current = JSON.stringify(FILTERS_DATA);
        DISPLAY_ITEMS = [];
        setPageNumber(1);
        const acceptedParams = [
          'adult',
          'child',
          'infant',
          'type',
          'sort',
          'originName',
          'destinationName',
        ];
        const acceptedQuery = Object.fromEntries(
          Object.entries(query).filter(([key]) => acceptedParams.includes(key)),
        );
        const filteredQuery = formatQueryObject(FILTERS_DATA);
        const finalQuery = { ...acceptedQuery, ...filteredQuery };
        // const queryStringFormatted = Object.entries(finalQuery)
        //   .map(([key, value]) =>
        //     Array.isArray(value)
        //       ? `${key}=${value.join(',')}`
        //       : `${key}=${value}`,
        //   )
        //   .join('&');
        //
        // const newUrl = `${asPath.split('?')[0]}?${queryStringFormatted}`;
        // console.log('as:', asPath, finalQuery);
        // push(newUrl, undefined, {scroll: false}).catch(() => new Error());
        push(
          {
            pathname: asPath.split('?')[0],
            query: queryString.stringify({ ...finalQuery }, { arrayFormat: 'comma' }),
          },
          undefined,
          { scroll: false },
        ).catch(() => new Error());
      }
    },
    [isMobile, push, query, pathname],
  );

  const handleClickedSortItem = () => {
    dispatch(scrollHandler({ status: false }));
    DISPLAY_ITEMS = [];
    setPageNumber(1);
  };

  return isMobile ? (
    <div className="rtl mobile">
      <HeaderHoc>
        <span className="text-3 text-weight-500">{query.id}</span>
      </HeaderHoc>
      <div>
        <section className={cn('d-flex bg-color-white', styles.mobile__filters)}>
          <button onClick={() => setVisible(true)} className="border-0 bg-transparent m-1">
            <FilterIcon />
          </button>
          {isLoading ? (
            <Skeleton
              type="sort"
              rtl
              uniqueKey="sort"
              className="bg-color-white ps-2"
              height="50"
              width="100%"
            />
          ) : (
            searchData?.sortList && (
              <SortList
                sortItems={searchData.sortList || undefined}
                clickedSortItem={handleClickedSortItem}
              />
            )
          )}
        </section>
        <BottomSheet
          className="rtl pa-2"
          blocking={!uuidExpired}
          open={visible}
          onDismiss={() => setVisible(!visible)}
          skipInitialTransition
          snapPoints={({ maxHeight }) => maxHeight * 0.9}
        >
          <FilterTour
            plpResultNumber={DISPLAY_ITEMS.length}
            isMobile={isMobile}
            filtersItems={searchData?.filter}
            handleFiltersData={handleFiltersData}
          />
        </BottomSheet>
      </div>
      <div className={cn('col-12', styles['mobile__cards-container'])}>
        {searchData?.data?.length === 0 && (
          <div className="text-center py-5">
            <NotFoundTourMobile />
            <p className="mt-4 color-grey-1" style={{ whiteSpace: 'pre-line' }}>
              متاسفانه نتیجه‌ای برای شما یافت نشد.{'\n'}لطفا مقادیر جستجوی خود را تغییر دهید.
            </p>
            <Button
              radius
              className="mt-5 w-50 bg-color-primary"
              onClick={() => void push('/tour')}
            >
              بازگشت
            </Button>
          </div>
        )}
        <DesktopTourCardList
          isLoading={isLoading}
          cardData={DISPLAY_ITEMS}
          callNewItems={pagination}
          setPageNumber={handlePageNumber}
          requestId={searchData?.requestID || ''}
        />
      </div>
    </div>
  ) : (
    <div dir={'rtl'} className="row mt-5">
      <div className="col-3 mb-3">
        {isLoading ? (
          <Skeleton
            type="filter"
            rtl
            uniqueKey="filter"
            className="bg-color-white h-100 p-2 d-block rounded"
            height="100%"
            width="100%"
          />
        ) : (
          <FilterTour
            plpResultNumber={DISPLAY_ITEMS.length}
            filtersItems={searchData?.filter}
            handleFiltersData={handleFiltersData}
          />
        )}
      </div>
      <div className="col-9">
        {isLoading ? (
          <Skeleton
            type="sortTour"
            rtl
            uniqueKey="sort"
            className="bg-color-white p-0 mb-0"
            height="38"
            width="100%"
          />
        ) : (
          searchData?.sortList && (
            <SortList
              sortItems={searchData.sortList || undefined}
              clickedSortItem={handleClickedSortItem}
            />
          )
        )}
        {searchData?.data?.length === 0 && (
          <div className="text-center py-5">
            <NotFoundTour />
          </div>
        )}
        <DesktopTourCardList
          isLoading={isLoading}
          cardData={DISPLAY_ITEMS}
          callNewItems={pagination}
          setPageNumber={handlePageNumber}
          requestId={searchData?.requestID || ''}
        />
      </div>
    </div>
  );
};

export default TourPlpContainer;
