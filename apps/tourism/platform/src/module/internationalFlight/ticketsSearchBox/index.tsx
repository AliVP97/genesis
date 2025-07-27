import React, { useEffect, useMemo, useRef, useState } from 'react';

import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useQuery } from 'react-query';

import DatePicker, { DateState } from 'containers/datepicker/selectDate';
import OriginDestination from 'components/originDestination';
import Button from 'components/button';
import TicketType from 'module/flights/tickets/ticket/ticketType';
import {
  DesktopOriginDestinationLocationsType,
  locationState,
  LocationType,
} from 'components/originDestination/interface';
import { searchTicketValidate } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';
import { removeCookie } from 'utils/helpers/coockieHelper';
import {
  internationalFlightUpdateLastSearchStorage,
  TInternationalFlightSearch,
} from 'utils/helpers/localstorageHelper';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import PassengerInput from 'components/passengerInput';
import { TCoupeType } from 'components/passengerInput/types';
import DesktopOriginDestination from 'components/desktopOriginDestination';
import {
  DesktopOriginDestinationDataMapperInputType,
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationStateType,
} from 'components/desktopOriginDestination/types';
import {
  getAirports,
  getBusiestTransportServiceProviders,
} from 'services/internationalFlight/airports';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import {
  TInternationalFlightCabinType,
  TInternationalFlightSearchAirportsResponse,
} from 'services/internationalFlight/airports/interface';
import { useLastSearchCalendarSystem } from 'utils/hooks/useLastSearchCalendarSystem';
import { useCalendarOccasions } from 'utils/hooks/useCalendarOccasions';
import { useAppSelector } from 'store/hook/storeHook';
import { selectSearchData } from 'store/slices/internationalFlight/selectors/search';
import { createUrl } from 'utils/handlePageValidation';
import { Passengers, SearchHistory } from './interface';
import { mapToDesktopOriginDestinationHistory } from './helper';
import createOriginDestinationLocation from './utils/createOriginDestinationLocation';
import getLastInternationalFlightSearches from '../search/helpers/getLastInternationalFlightSearches';
import { CabinType, SearchQuery } from '../search/types/common';
import createLocationState from './utils/createLocationState';
import toGregorianTime from './utils/toGregorianTime';
import {
  CABIN_TYPES,
  QUERY_LOCATION_TYPES,
  QUERY_SORTS,
  QUERY_TRIP_TYPES,
  TRIP_TYPES,
} from '../search/constants/common';
import internationalFlightQuerySchema from '../search/constants/internationalFlightQuerySchema';
import useCalendarPrice from './hooks/useCalendarPrice';
import { FLIGHT_TYPES, FlightType } from './types/common';

import styles from './style.module.scss';

const initialState: locationState = {
  origin: { city: '', value: '', airport: '' },
  destination: { city: '', value: '', airport: '' },
};

const mapToDesktopOriginDestinationState: (
  state: locationState,
) => DesktopOriginDestinationStateType = (state) => {
  return {
    origin: {
      id: state.origin?.value ?? '',
      title: state.origin?.city ?? '',
      description: state.origin?.airport ?? '',
      type: state.origin?.type ?? { id: 'AIRPORT', title: '' },
      data: state.origin?.data ?? {},
    },
    destination: {
      id: state.destination?.value,
      title: state.destination?.city,
      description: state.destination?.airport,
      type: state.destination?.type,
      data: state.destination?.data,
    },
  };
};

const mapToLocationState: (state: DesktopOriginDestinationStateType) => locationState = (state) => {
  return {
    origin: {
      value: state.origin.id,
      city: state.origin.title as string,
      airport: state.origin.description as string,
      type: state.origin.type,
      data: {
        cityTitle: state?.origin?.data?.cityTitle || '',
      },
    },
    destination: {
      value: state.destination.id,
      city: state.destination.title as string,
      airport: state.destination.description as string,
      type: state.destination.type,
      data: {
        cityTitle: state?.destination?.data?.cityTitle || '',
      },
    },
  };
};

export type FlightIntlDefaultQuery = {
  departureDate: string;
  adult: number;
  child: number;
  infant: number;
  returningDate?: string;
  sort: string;
  cabinType: string;
  tripMode: string;
  airlines?: string;
  departureTime?: string;
  returningTime?: string;
  departureDuration?: string;
  returningDuration?: string;
  departureStops?: string;
  returningStops?: string;
  ticketType?: string;
  originType: number;
  destinationType: number;
};

const TicketsSearchBox = () => {
  // UseRedirectShortUrl();

  const { data: busiestTransportServiceProviders } = useQuery(
    ['busiestTransportServiceProviders-internationalFlight'],
    getBusiestTransportServiceProviders,

    {
      enabled: true,
      staleTime: Infinity,
    },
  );

  const router = useRouter();
  const [passengers, setPassengers] = useState<Passengers>({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [date, setDate] = useState<DateState>({
    to: null,
    from: null,
  });
  const [cabinType, setCabinType] = useState<CabinType>(() => {
    const lastSearches = getLastInternationalFlightSearches();

    if (!lastSearches) {
      return CABIN_TYPES.ECONOMY;
    }

    return lastSearches[0].cabinType;
  });

  const [location, setLocation] = useState<locationState>(initialState);
  const [activeInput, setActiveInput] = useState<'datepicker' | 'passenger' | null>(null);
  const [showPassenger, setShowPassenger] = useState(false);

  const defaultFlightType =
    typeof localStorage !== 'undefined' && localStorage?.getItem('international_flight_last_search')
      ? JSON.parse(localStorage?.getItem('international_flight_last_search') as string)?.[0]
          .returningDate
        ? 'roundTrip'
        : 'oneWay'
      : 'oneWay';
  const [flightType, setFlightType] = useState<FlightType>(defaultFlightType);
  const { isMobile } = useDeviceDetect();
  const searchData = useAppSelector(selectSearchData);

  useEffect(() => {
    if (activeInput === 'passenger') {
      setShowPassenger(true);
    }
  }, [activeInput]);

  const handleChangeFlightType = (type: FlightType) => {
    if (type === 'roundTrip') {
      setDate((prevState) => ({
        ...prevState,
        from: +dayjs(searchData.dates.departure, { jalali: true }),
        to: searchData.dates.returning
          ? +dayjs(searchData.dates.returning, { jalali: true })
          : null,
      }));
    }
    setFlightType(type);
  };

  const nextInput = (input: 'datepicker' | 'passenger' | null) => {
    setActiveInput(input);
  };

  const submitLocation = (value: locationState) => {
    setLocation((prev) => ({ ...prev, ...value }));
    if (value?.origin?.value && value?.destination?.value && activeInput !== 'passenger') {
      if (flightType === 'oneWay' && !date.from) {
        nextInput('datepicker');
      } else if (flightType === 'roundTrip' && !date.from && !date.to) {
        nextInput('datepicker');
      }
    }
  };

  const [desktopOriginDestinationHistory, setDesktopOriginDestinationHistory] =
    useState<DesktopOriginDestinationHistoryType>();
  useEffect(() => {
    setDesktopOriginDestinationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.international_flight_last_search || '[]').slice(0, 3),
      ),
    );
  }, []);
  const handleDesktopOriginDestinationClearHistory = (e: LocationType) => {
    const lastSearch = JSON.parse(localStorage.international_flight_last_search);
    lastSearch.forEach((lastSearchItem: SearchHistory) => {
      lastSearchItem[e] = undefined;
    });
    localStorage.setItem('international_flight_last_search', JSON.stringify(lastSearch));

    setDesktopOriginDestinationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.international_flight_last_search || '[]').slice(0, 3),
      ),
    );
  };

  const handleDatePickerCalendarSystemChange = (calendarSystem: string) => {
    localStorage.setItem('searchCalendarSystem', calendarSystem);
  };

  const pushSearch = () => {
    const sortedQueryKeys = Object.keys(internationalFlightQuerySchema.shape);
    const resolvedUrl =
      WEB.INTERNATIONAL + location.origin?.value + '-' + location.destination?.value;

    const query: SearchQuery = {
      adult: String(passengers.adult),
      child: String(passengers.child),
      infant: String(passengers.infant),
      departureDate: dayjs(date.from).calendar('jalali').format('YYYY-MM-DD'),
      sort: QUERY_SORTS.LOW_PRICE,
      cabinType: cabinType,
      tripMode: flightType === 'oneWay' ? QUERY_TRIP_TYPES.ONE_WAY : QUERY_TRIP_TYPES.ROUND_TRIP,
      originType:
        location.origin?.type?.id === 'AIRPORT'
          ? QUERY_LOCATION_TYPES.AIRPORT
          : QUERY_LOCATION_TYPES.CITY,
      destinationType:
        location.destination?.type?.id === 'AIRPORT'
          ? QUERY_LOCATION_TYPES.AIRPORT
          : QUERY_LOCATION_TYPES.CITY,
    };

    if (flightType === 'roundTrip' && date.to) {
      query.returningDate = dayjs(date.to).calendar('jalali').format('YYYY-MM-DD');
    }

    const url = createUrl(resolvedUrl, sortedQueryKeys, undefined, query);
    router.push(url, undefined, { shallow: true });
  };

  const desktopOriginDestinationDataMapper = (
    response?: DesktopOriginDestinationDataMapperInputType,
  ) =>
    (response as TInternationalFlightSearchAirportsResponse)?.results?.map(
      createOriginDestinationLocation,
    ) as DesktopOriginDestinationLocationsType;

  const isSuperApp = useIsSuperApp();

  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  const { calendarSystem, handleCalendarSystemChange } = useLastSearchCalendarSystem(
    'international_flight_last_search',
  );

  const calendarOccasions = useCalendarOccasions();

  const isPassengerShowed = useRef(false);

  useEffect(() => {
    if (showPassenger) {
      isPassengerShowed.current = true;
    }
  }, [showPassenger]);

  function handleDatePickerConfirm() {
    if (!isPassengerShowed.current) {
      setShowPassenger(true);
    }
  }

  useEffect(() => {
    const {
      dates,
      locations,
      passengers: searchedPassengers,
      tripType,
      cabinType: searchedCabinType,
    } = searchData;
    const departureDate = toGregorianTime(dates.departure);
    const returningDate =
      tripType === TRIP_TYPES.ROUND_TRIP &&
      toGregorianTime() === toGregorianTime(dates.returning as string)
        ? null
        : toGregorianTime(dates.returning as string);

    setLocation(createLocationState(locations));

    if (!locations.origin) {
      return;
    }

    setCabinType(searchedCabinType);
    setPassengers(searchedPassengers);
    setDate({ from: departureDate, to: returningDate });
    setFlightType(tripType === TRIP_TYPES.ONE_WAY ? 'oneWay' : 'roundTrip');
  }, [searchData, router.query]);

  /**
   * Keeping searchData in memory for multiple purposes, first for pushSearch
   * then to determines which is the same and disable search button.
   */
  const currentSearch: TInternationalFlightSearch = useMemo(() => {
    return {
      origin: location.origin ?? {
        airport: '',
        city: '',
        type: { id: '', title: '' },
        value: '',
      },
      destination: location.destination,
      passenger: passengers,
      departureDate: dayjs(date.from).format('YYYY-MM-DD'),
      returningDate:
        date.to && flightType === 'roundTrip' ? dayjs(date.to).format('YYYY-MM-DD') : undefined,
      cabinType: cabinType as TInternationalFlightCabinType,
      calendarSystem: calendarSystem,
      sort: 'lowPrice',
    };
  }, [cabinType, calendarSystem, date, flightType, location, passengers]);

  const submitSearch = () => {
    try {
      setSearchButtonClicked(true);
      searchTicketValidate(location as locationState, flightType, [date.from, date.to]);
      internationalFlightUpdateLastSearchStorage(currentSearch);

      removeCookie('uuid');

      pushSearch();
      setDesktopOriginDestinationHistory(
        mapToDesktopOriginDestinationHistory(
          JSON.parse(localStorage.international_flight_last_search || '[]').slice(0, 3),
        ),
      );
    } catch (error) {
      notify({
        config: {
          position: 'bottom-right',
          autoClose: false,
          hideProgressBar: true,
        },
        message: <span className="text-weight-500 fa">{(error as Error).message}</span>,
        type: 'warning',
      });
    }
  };

  const isSearchButtonDisabled =
    !internationalFlightQuerySchema.safeParse(currentSearch).success ||
    (flightType === 'roundTrip' && !date.to);

  const { handleMonthChange, daysContents } = useCalendarPrice(
    location,
    flightType === FLIGHT_TYPES.ONE_WAY,
  );

  return (
    <div
      className={classNames('container-xxl p-0 px-3', `${isSuperApp ? styles['is-superapp'] : ''}`)}
    >
      <div className="row flex-row-reverse g-0">
        <div className="col-12 px-1">
          <TicketType type={flightType} onChange={handleChangeFlightType} />
        </div>
        <div className="col-12 col-lg-4 col-md-12 px-1">
          <>
            {isMobile ? (
              <OriginDestination
                defaultData={{
                  title: 'فرودگاه های پرتردد',
                  /* value: desktopOriginDestinationDataMapper({
                  airports: domesticBusiest,
                }), */
                  value: desktopOriginDestinationDataMapper(
                    busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
                  ),
                }}
                state={mapToDesktopOriginDestinationState(location as locationState)}
                onSelect={(e) => {
                  submitLocation(mapToLocationState(e));
                }}
                api={{
                  fetcher: getAirports,
                  // params: {domestic: true},
                  dataMapper: desktopOriginDestinationDataMapper,
                }}
                history={desktopOriginDestinationHistory}
                onClearHistory={handleDesktopOriginDestinationClearHistory}
                inputCharsLengthToSearch={2}
              />
            ) : (
              <DesktopOriginDestination
                defaultData={{
                  title: 'فرودگاه های پرتردد',
                  /* value: desktopOriginDestinationDataMapper({
                  airports: domesticBusiest,
                }), */
                  value: desktopOriginDestinationDataMapper(
                    busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
                  ),
                }}
                state={mapToDesktopOriginDestinationState(location as locationState)}
                onSelect={(e) => {
                  submitLocation(mapToLocationState(e));
                }}
                api={{
                  fetcher: getAirports,
                  // params: {domestic: true},
                  dataMapper: desktopOriginDestinationDataMapper,
                }}
                history={desktopOriginDestinationHistory}
                onClearHistory={handleDesktopOriginDestinationClearHistory}
                showDescription
                inputCharsLengthToSearch={2}
              />
            )}
          </>
        </div>
        <div className={classNames('col-12 col-lg-4 px-1 mb-1 col-md-6 my-2 my-lg-0')}>
          <DatePicker
            view={isMobile ? 'mobile' : 'desktop'}
            value={date}
            setValue={setDate}
            title={
              (location.origin?.data?.cityTitle || '') +
              (location.origin?.data?.cityTitle && location.destination?.data?.cityTitle
                ? ' - '
                : '') +
              (location.destination?.data?.cityTitle || '')
            }
            range={flightType === 'roundTrip'}
            open={activeInput === 'datepicker'}
            /* onClose={() => {
              if (
                activeInput === 'datepicker' &&
                location.origin.value &&
                location.destination.value
              ) {
                nextInput('passenger');
              }
            }} */
            calendarSystem={calendarSystem}
            onCalendarSystemChange={(e) => {
              handleDatePickerCalendarSystemChange(e);
              handleCalendarSystemChange(e);
            }}
            occasions={calendarOccasions}
            onConfirm={handleDatePickerConfirm}
            daysContents={daysContents}
            onMonthChange={handleMonthChange}
          />
        </div>
        <div className={classNames('col-12 col-md-3 col-lg-2 px-1  my-2 my-lg-0')} dir="rtl">
          <PassengerInput
            passengers={passengers}
            setPassengers={setPassengers}
            showPassenger={showPassenger}
            setShowPassenger={(value) => setShowPassenger(value)}
            coupeType={cabinType}
            setCoupeType={setCabinType as React.Dispatch<React.SetStateAction<TCoupeType>>}
          />
        </div>

        <div
          className={classNames(
            styles.searchTicket__btn,
            'col-lg-2 px-md-3  col-md-3  my-md-0 d-flex align-items-center  my-2 my-lg-0',
          )}
        >
          <Button
            radius
            className="btn btn-primary d-block w-100"
            btnType="button"
            onClick={submitSearch}
            loading={searchButtonClicked && routeChangeStarted}
            disabled={isSearchButtonDisabled}
          >
            جستجوی سفر
          </Button>
        </div>
      </div>
    </div>
  );
};
export default TicketsSearchBox;
