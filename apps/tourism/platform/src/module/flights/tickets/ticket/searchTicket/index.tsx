import React, { useEffect, useState, useRef } from 'react';

import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import classNames from 'classnames';
import { useQuery } from 'react-query';

import DatePicker, { DateState } from 'containers/datepicker/selectDate';
import Button from 'components/button';
import TicketType from 'module/flights/tickets/ticket/ticketType';
import { LocationType, locationState } from 'components/originDestination/interface';
import { searchTicketValidate } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';
import { removeCookie } from 'utils/helpers/coockieHelper';
import { updateLastSearchStorage } from 'utils/helpers/localstorageHelper';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import PassengerInput from 'components/passengerInput';
import { TDaysPrices } from 'services/domestic/flight/interface';
import { TDaysContents } from 'containers/datepicker/datepicker/types';
import DesktopOriginDestination from 'components/desktopOriginDestination';
import OriginDestination from 'components/originDestination';
import {
  DesktopOriginDestinationLocationsType,
  DesktopOriginDestinationStateType,
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationDataMapperInputType,
} from 'components/desktopOriginDestination/types';
import { searchAirport, getBusiestTransportServiceProviders } from 'services/domestic/flight';
import { SearchAirportsResponse } from 'services/domestic/flight/interface';
import { DomesticFlightIcon } from 'assets/icons';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { useLastSearchCalendarSystem } from 'utils/hooks/useLastSearchCalendarSystem';
import { useCalendarOccasions } from 'utils/hooks/useCalendarOccasions';
import getServicesTabOffsetTop from 'utils/helpers/servicesTabScrollTopPosition';
import { scrollHandler } from 'store/slices/domestic-flights/mainPageScrollPlace';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { Passengers, SearchHistory } from './interface';
import { isDisable, mapToDesktopOriginDestinationHistory } from './helper';
import useCalendarPrice from './hook/useCalendarPrice';

import styles from './search-ticket.module.scss';

const toGregorianTime = (date?: string) => dayjs(date, { jalali: true }).toDate().getTime();

export type FlightType = 'oneWay' | 'roundTrip';

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
    },
    destination: {
      id: state.destination?.value,
      title: state.destination?.city,
      description: state.destination?.airport,
    },
  };
};

const mapToLocationState: (state: DesktopOriginDestinationStateType) => locationState = (state) => {
  return {
    origin: {
      value: state.origin.id,
      city: state.origin.title as string,
      airport: state.origin.description as string,
      clicked: state.origin.clicked ? state.origin.clicked : false,
    },
    destination: {
      value: state.destination.id,
      city: state.destination.title as string,
      airport: state.destination.description as string,
      clicked: state.destination.clicked ? state.destination.clicked : false,
    },
  };
};

const SearchTicket = () => {
  const dispatch = useAppDispatch();
  const [flightType, setFlightType] = useState<FlightType>('oneWay');
  const [location, setLocation] = useState<locationState>(initialState);
  const [date, setDate] = useState<DateState>({
    to: null,
    from: null,
  });
  const { isMobile } = useDeviceDetect();
  const { handleMonthChange, daysPrices } = useCalendarPrice(flightType, location, date);
  const searchBtn = useRef<HTMLButtonElement>(null);
  const { data: busiestTransportServiceProviders } = useQuery(
    ['busiestTransportServiceProviders-domesticFlight'],
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
  const searchData = useAppSelector((state) => state.domesticFlightsReducer.search);

  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [activeInput, setActiveInput] = useState<'datepicker' | 'passenger' | null>(null);
  const [showPassenger, setShowPassenger] = useState(false);

  const { calendarSystem, handleCalendarSystemChange } = useLastSearchCalendarSystem('last_search');

  const toDaysContents = (days: TDaysPrices | undefined) => {
    const contents: TDaysContents = {};
    days?.forEach((day) => {
      const key =
        day.persianDepartureDate &&
        day.persianDepartureDate
          .substring(0, 10)
          .split('')
          .filter((dateItem) => dateItem !== '-')
          .join('');
      if (key) {
        contents[key] = { secondary: day.minimumPrice };
      }
    });
    return contents;
  };

  useEffect(() => {
    const { dates, locations, passengers: searchedPassengers } = searchData;
    const departureDate = toGregorianTime(dates.departure);
    const returningDate =
      toGregorianTime() === toGregorianTime(dates.returning as string)
        ? null
        : toGregorianTime(dates.returning as string);

    setLocation({
      destination: {
        city: locations.destination.city,
        airport: locations.destination.airport,
        value: locations.destination.value,
      },
      origin: locations.origin
        ? {
            city: locations.origin.city,
            airport: locations.origin.airport,
            value: locations.origin.value,
          }
        : {
            city: '',
            airport: '',
            value: '',
          },
    });

    if (!locations.origin) {
      return;
    }

    setPassengers(searchedPassengers);
    setDate({ from: departureDate, to: returningDate });
    setFlightType(!dates.returning ? 'oneWay' : 'roundTrip');
  }, [searchData, router.query]);

  useEffect(() => {
    if (activeInput === 'passenger') {
      setShowPassenger(true);
    }
  }, [activeInput]);

  const handleChangeFlightType = (type: FlightType) => {
    setFlightType(type);
  };

  const checkInputsValidation = (
    originValue: string | undefined,
    DestinationValue: string | undefined,
  ) => {
    return (
      !!originValue &&
      originValue !== 'undefined' &&
      !!DestinationValue &&
      DestinationValue !== 'undefined'
    );
  };

  const nextInput = (input: 'datepicker' | 'passenger' | null) => {
    setActiveInput(input);
  };

  const submitLocation = (value: locationState) => {
    setLocation((prev) => ({ ...prev, ...value }));
    if (
      checkInputsValidation(value?.origin?.value, value?.destination?.value) &&
      value?.destination?.clicked
    ) {
      nextInput('datepicker');
    }
  };

  useEffect(() => {
    if (!showPassenger) {
      setActiveInput(null);
      if (
        checkInputsValidation(location?.origin?.value, location?.destination?.value) &&
        (flightType === 'oneWay' ? !!date.from : !!date.from && !!date.to)
      ) {
        searchBtn?.current?.focus();
      }
    }
  }, [showPassenger]);

  const [desktopOriginDestinationHistory, setDesktopOriginDestinationHistory] =
    useState<DesktopOriginDestinationHistoryType>();
  useEffect(() => {
    setDesktopOriginDestinationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.last_search || '[]').slice(0, 3),
      ),
    );
  }, []);
  const handleDesktopOriginDestinationClearHistory = (e: LocationType) => {
    const lastSearch = JSON.parse(localStorage.last_search);
    lastSearch.forEach((lastSearchItem: SearchHistory) => {
      lastSearchItem[e] = undefined;
    });
    localStorage.setItem('last_search', JSON.stringify(lastSearch));

    setDesktopOriginDestinationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.last_search || '[]').slice(0, 3),
      ),
    );
  };

  const pushSearch = () => {
    const queryObject: {
      departureDate: string;
      adult: number;
      child: number;
      infant: number;
      returningDate?: string;
      sort: string;
    } = {
      ...passengers,
      departureDate: dayjs(date.from).calendar('jalali').format('YYYY-MM-DD'),
      returningDate:
        date.to && flightType === 'roundTrip'
          ? dayjs(date.to).calendar('jalali').format('YYYY-MM-DD')
          : undefined,
      sort: 'lowPrice',
    };

    router
      .push(
        {
          pathname: WEB.DOMESTIC_SEARCH + location.origin?.value + '-' + location.destination.value,
          query: queryString.stringify(queryObject),
        },
        undefined,
        { scroll: false },
      )
      .then(() => {
        dispatch(scrollHandler({ status: false }));
        setTimeout(() => {
          getServicesTabOffsetTop();
        }, 500);
      });
  };

  const submitSearch = () => {
    try {
      setSearchButtonClicked(true);
      searchTicketValidate(location, flightType, [date.from, date.to]);
      updateLastSearchStorage({
        origin: location.origin,
        destination: location.destination,
        departureDate: dayjs(date.from).format('YYYY-MM-DD'),
        returningDate:
          date.to && flightType === 'roundTrip' ? dayjs(date.to).format('YYYY-MM-DD') : undefined,
        passenger: passengers,
        calendarSystem: calendarSystem,
      });

      removeCookie('uuid');

      pushSearch();

      setDesktopOriginDestinationHistory(
        mapToDesktopOriginDestinationHistory(
          JSON.parse(localStorage.last_search || '[]').slice(0, 3),
        ),
      );
    } catch (error) {
      notify({
        config: {
          position: 'bottom-right',
          autoClose: false,
          hideProgressBar: true,
        },
        message: <span className="text-weight-500 fa">{(error as Error).message as string}</span>,
        type: 'warning',
      });
    }
  };

  const desktopOriginDestinationDataMapper = (
    response?: DesktopOriginDestinationDataMapperInputType,
  ) => {
    return (response as SearchAirportsResponse)?.airports?.map((item) => ({
      id: item.iata,
      icon: <DomesticFlightIcon />,
      title: item?.city?.name?.farsi,
      description: item?.name?.farsi,
    })) as DesktopOriginDestinationLocationsType;
  };

  const isSuperApp = useIsSuperApp();

  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  const calendarOccasions = useCalendarOccasions();

  const routingText = () => {
    const [start, end] =
      date?.from && !date?.to && flightType === 'roundTrip'
        ? [location?.destination?.city, location?.origin?.city]
        : [location?.origin?.city, location?.destination?.city];
    return `${start || ''}${start && end ? ' به ' : ''}${end || ''}`;
  };

  return (
    <div
      className={classNames('container-xxl p-0 px-3', `${isSuperApp ? styles['is-superapp'] : ''}`)}
    >
      <div className="row flex-row-reverse g-0">
        <div className="col-12 px-1">
          <TicketType type={flightType} onChange={handleChangeFlightType} />
        </div>
        <div className="col-12 col-lg-4 col-md-12 px-1 ">
          {isMobile ? (
            <OriginDestination
              defaultData={{
                title: 'فرودگاه های پرتردد',
                value: desktopOriginDestinationDataMapper(
                  busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
                ),
              }}
              state={mapToDesktopOriginDestinationState(location)}
              onSelect={(e) => {
                submitLocation(mapToLocationState(e));
              }}
              api={{
                fetcher: searchAirport,
                params: { domestic: true },
                dataMapper: desktopOriginDestinationDataMapper,
              }}
              history={desktopOriginDestinationHistory}
              onClearHistory={handleDesktopOriginDestinationClearHistory}
            />
          ) : (
            <DesktopOriginDestination
              defaultData={{
                title: 'فرودگاه های پرتردد',
                value: desktopOriginDestinationDataMapper(
                  busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
                ),
              }}
              state={mapToDesktopOriginDestinationState(location)}
              onSelect={(e) => {
                submitLocation(mapToLocationState(e));
              }}
              api={{
                fetcher: searchAirport,
                params: { domestic: true },
                dataMapper: desktopOriginDestinationDataMapper,
              }}
              history={desktopOriginDestinationHistory}
              onClearHistory={handleDesktopOriginDestinationClearHistory}
            />
          )}
        </div>
        <div className={classNames('col-12 col-lg-4 px-1 mb-1 col-md-6 my-2 my-lg-0')}>
          <DatePicker
            view={isMobile ? 'mobile' : 'desktop'}
            value={date}
            setValue={setDate}
            title={routingText()}
            range={flightType === 'roundTrip'}
            open={activeInput === 'datepicker'}
            onConfirm={() => {
              if (checkInputsValidation(location?.origin?.value, location?.destination?.value)) {
                nextInput('passenger');
              }
            }}
            onClose={() => nextInput(null)}
            daysContents={toDaysContents(daysPrices)}
            calendarSystem={calendarSystem}
            onCalendarSystemChange={(e) => {
              handleCalendarSystemChange(e);
            }}
            occasions={calendarOccasions}
            onMonthChange={handleMonthChange}
          />
        </div>
        <div className={classNames('col-12 col-md-3 col-lg-2 px-1  my-2 my-lg-0')} dir="rtl">
          <PassengerInput
            passengers={passengers}
            setPassengers={setPassengers}
            showPassenger={showPassenger}
            setShowPassenger={(value) => setShowPassenger(value)}
          />
        </div>

        <div
          className={classNames(
            styles.searchTicket__btn,
            'col-lg-2 px-md-3  col-md-3  my-md-0 d-flex align-items-center  my-2 my-lg-0',
          )}
        >
          <Button
            ref={searchBtn}
            radius
            className="btn btn-primary d-block w-100"
            btnType="button"
            onClick={submitSearch}
            loading={searchButtonClicked && routeChangeStarted}
            disabled={isDisable({
              flightType,
              originLocation: location?.origin?.value,
              destinationLocation: location?.destination?.value,
              dateFrom: date?.from,
              dateTo: date?.to,
              passenger: passengers?.adult,
            })}
          >
            جستجوی سفر
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchTicket;
