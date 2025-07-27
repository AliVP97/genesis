import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useQuery } from 'react-query';

import DatePicker, { DateState } from 'containers/datepicker/selectDate';
import DesktopOriginDestination from 'components/desktopOriginDestination';
import OriginDestination from 'components/originDestination';
import Button from 'components/button';
import { locationState } from 'components/originDestination/interface';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';
import { removeCookie } from 'utils/helpers/coockieHelper';
import { hotelUpdateLastSearchStorage } from 'utils/helpers/localstorageHelper';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import PassengerInput from 'components/passengerInput';
import { useLastSearchCalendarSystem } from 'utils/hooks/useLastSearchCalendarSystem';
import {
  DesktopOriginDestinationStateType,
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationDataMapperInputType,
  DesktopOriginDestinationLocationsType,
} from 'components/desktopOriginDestination/types';
import { getBusiestTransportServiceProviders } from 'services/hotel/hotelsAndCities';
import { getCitiesAndHotels } from 'services/hotel/hotelsAndCities';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { THotelsAndCitiesResponse } from 'services/hotel/hotelsAndCities/interface';
import { PlaceIcon, ManLaidOnBedIcon } from 'assets/icons';
import { searchHotelTicketValidate } from 'utils/helpers/validations';
import { useCalendarOccasions } from 'utils/hooks/useCalendarOccasions';

import { HotelPassengers, SearchHistory, TQueryObject } from './interface';
import { mapToDesktopOriginDestinationHistory, isDisable } from './helper';
import { usePrepareRequestHandler } from '../search/hooks/usePrepareRequestHandler';
import { queryToQueryString } from '../../../utils/helpers/global';

import styles from './style.module.scss';

const initialState: locationState = {
  origin: { city: '', value: '', airport: '', type: { id: '', title: '' }, cityEng: '' },
  destination: { city: '', value: '', airport: '', type: { id: '', title: '' }, cityEng: '' },
};

const mapToDesktopOriginDestinationState: (
  state: locationState,
) => DesktopOriginDestinationStateType = (state) => {
  return {
    origin: {
      id: state.origin?.value,
      title: state.origin?.city,

      description: state.origin?.airport,
      type: state.origin?.type,
    },
    destination: {
      id: state.destination?.value,
      title: state.destination?.city,
    },
  };
};

const mapToLocationState: (state: DesktopOriginDestinationStateType) => locationState = (state) => {
  return {
    origin: {
      value: state.origin.id,
      city: state.origin.title as string, // WARNING: Remove type assertions.
      airport: state.origin.description as string,
      type: state.origin.type,
      cityEng: state.origin.titleEng || state.origin.cityEng,
      data: {
        cityId: state.origin.data?.cityId || '',
        cityName: state.origin.data?.cityName || '',
        uuid: state.origin.data?.uuid || '',
      },
    },
    destination: {
      value: state.destination.id,
      city: state.destination.title as string,
      airport: state.destination.description as string,
      type: state.origin.type,
      cityEng: state.origin.title as string,
    },
  };
};

const TicketsSearchBox = () => {
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

  const { data: busiestTransportServiceProviders } = useQuery(
    ['busiestTransportServiceProviders-hotel'],
    getBusiestTransportServiceProviders,

    {
      enabled: true,
      staleTime: Infinity,
    },
  );

  const router = useRouter();
  const [passengers, setPassengers] = useState<Array<HotelPassengers>>([
    {
      adult: 1,
      child: [],
    },
  ]);
  const [passengersInputValue, setPassengersInputValue] = useState<Array<HotelPassengers>>([
    {
      adult: 1,
      child: [],
    },
  ]);
  const handlePassengerSubmit = () => {
    setPassengersInputValue(passengers);
  };
  const [date, setDate] = useState<DateState>({
    to: null,
    from: null,
  });

  const [location, setLocation] = useState<locationState>(initialState);
  const [activeInput, setActiveInput] = useState<'datepicker' | 'passenger' | null>(null);
  const [showPassenger, setShowPassenger] = useState(false);
  useEffect(() => {
    setPassengers(passengersInputValue);
  }, [showPassenger]);
  const { isMobile } = useDeviceDetect();

  useEffect(() => {
    if (activeInput === 'passenger') {
      setShowPassenger(true);
    }
  }, [activeInput]);

  const nextInput = (input: 'datepicker' | 'passenger' | null) => {
    setActiveInput(input);
  };

  const submitLocation = (value: locationState) => {
    setLocation((prev) => ({ ...prev, ...value }));
    if (
      value?.origin?.value &&
      // value?.destination?.value &&
      activeInput !== 'passenger'
    ) {
      nextInput('datepicker');
    }
  };

  const [desktopOriginDestinationHistory, setDesktopOriginDestinationHistory] =
    useState<DesktopOriginDestinationHistoryType>();
  useEffect(() => {
    setDesktopOriginDestinationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.hotel_last_search || '[]')
          .filter((item: any) => item.origin && item.origin.cityEng)
          .slice(0, 3),
      ),
    );
  }, []);
  const handleDesktopOriginDestinationClearHistory = () => {
    localStorage.removeItem('hotel_last_search');
    setDesktopOriginDestinationHistory(
      mapToDesktopOriginDestinationHistory(
        JSON.parse(localStorage.hotel_last_search || '[]').slice(0, 3),
      ),
    );
  };
  const { prepareRequestHandler, requestIdData, prepareSuccess, loadingPrepare } =
    usePrepareRequestHandler();

  const getQueryObject = () => {
    let selectedRooms = '';
    passengers.map((item) => {
      selectedRooms =
        selectedRooms +
        (selectedRooms ? '-' : '') +
        Array.from({ length: item.adult }, () => 'A').toString();
      if (item?.child.length > 0)
        selectedRooms = selectedRooms + '___' + item?.child?.map((x) => x.value).toString();
      return selectedRooms;
    });
    return {
      requestId: location.origin.value,
      checkInDate: dayjs(date.from).calendar('jalali').format('YYYY-MM-DD'),
      checkOutDate: dayjs(date.to).calendar('jalali').format('YYYY-MM-DD'),
      rooms: selectedRooms,
      destinationType: location?.origin?.type?.id || '',
      sort: 'offer',
      cityId: location.origin.data?.cityId,
      cityName: location.origin.city,
      cityNameEng: location.origin.cityEng,
    };
  };

  const changeUrl = () => {
    const queryObject: TQueryObject = getQueryObject();
    if (location?.origin?.type?.id == 'hotel' && prepareSuccess) {
      void router.push(
        `${WEB.HOTEL + '/' + location?.origin.cityEng}/${location?.origin?.data?.uuid}/` +
          `?hotelId=${location.origin.value}&rooms=${queryObject?.rooms}&requestId=${requestIdData?.requestId}`,
      );
    } else if (location?.origin?.type?.id == 'city') {
      queryObject.readCache = 'true';
      void router.push(
        {
          pathname: `${WEB.HOTEL + (location.origin.cityEng as string).toLocaleLowerCase()}`,
          query: queryToQueryString(queryObject),
        },
        undefined,
        { shallow: true },
      );
    }
  };

  useEffect(() => {
    if (searchButtonClicked) changeUrl();
  }, [requestIdData]);

  const { calendarSystem, handleCalendarSystemChange } =
    useLastSearchCalendarSystem('hotel_last_search');

  const submitSearch = async () => {
    try {
      setSearchButtonClicked(true);
      //todo:add validate
      searchHotelTicketValidate(location, [date.from, date.to]);
      const queryObject: TQueryObject = getQueryObject();
      // localStorage.setItem('search-query', JSON.stringify(queryObject));
      if (location?.origin?.type?.id == 'hotel') await prepareRequestHandler(queryObject);

      hotelUpdateLastSearchStorage({
        //to do
        origin: location.origin,
        passenger: passengers,
        departureDate: dayjs(date.from).format('YYYY-MM-DD'),
        returningDate: dayjs(date.to).format('YYYY-MM-DD'),
        calendarSystem: calendarSystem,
      });
      removeCookie('uuid');
      changeUrl();
      setDesktopOriginDestinationHistory(
        mapToDesktopOriginDestinationHistory(
          JSON.parse(localStorage.hotel_last_search || '[]').slice(0, 3),
        ),
      );
    } catch (e) {
      notify({
        config: {
          position: 'bottom-right',
          autoClose: false,
          hideProgressBar: true,
        },
        message: <span className="text-weight-500 fa">{(e as Error).message}</span>,
        type: 'warning',
      });
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem('searchHotel') && date.from) {
      const queryObject: TQueryObject = getQueryObject();
      prepareRequestHandler(queryObject);
      setSearchButtonClicked(true);
      sessionStorage.removeItem('searchHotel');
    }
  }, [date]);

  const handleDatePickerCalendarSystemChange = (selectedCalendarSystem: string) => {
    localStorage.setItem('searchCalendarSystem', selectedCalendarSystem);
  };
  /*The useEffect below fill the inputs of hotel's search based on lastSearch of user*/
  useEffect(() => {
    if (router?.query?.readCache === 'true') {
      const lastSearch: SearchHistory[] | [] = JSON.parse(
        localStorage.getItem('hotel_last_search') as string,
      );
      if (lastSearch?.length) {
        const departureDate = new Date(lastSearch[0].departureDate).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (departureDate >= today) {
          setLocation({
            origin: lastSearch[0].origin,
            destination: lastSearch[0].destination,
          });
          setPassengers(lastSearch[0].passenger);
          setPassengersInputValue(lastSearch[0].passenger);

          if (lastSearch[0].returningDate) {
            const returningDate = new Date(lastSearch[0].returningDate).setHours(0, 0, 0, 0);

            if (returningDate >= departureDate) {
              setDate((prevState) => ({
                ...prevState,
                from: +dayjs(lastSearch[0].departureDate),
                to: +dayjs(lastSearch[0].returningDate),
              }));
            }
          } else {
            setDate((prevState) => ({
              ...prevState,
              from: +dayjs(lastSearch[0].departureDate),
              to: null,
            }));
          }
        }
      }
    }
  }, [router?.query?.readCache]);
  const desktopOriginDestinationDataMapper = (
    response?: DesktopOriginDestinationDataMapperInputType,
  ): DesktopOriginDestinationLocationsType => {
    const cities = (response as THotelsAndCitiesResponse)?.cities?.map((city) => ({
      id: city.cityId,
      title: city.name,
      titleEng: city.nameEng,
      subTitle: city.province,
      icon: <PlaceIcon className="fill-grey-2" />,
      type: {
        id: 'city',
        title: 'شهر',
      },
    }));

    const hotels = (response as THotelsAndCitiesResponse)?.hotels?.map((hotel) => ({
      id: hotel.hotelId,
      title: hotel.name,
      subTitle: hotel.city?.province,
      titleEng: hotel?.city?.nameEng,
      icon: (
        <span>
          <ManLaidOnBedIcon className="fill-grey-2" />
        </span>
      ),
      type: {
        id: 'hotel',
        title: 'هتل',
      },
      data: {
        cityId: hotel.city?.cityId,
        cityName: hotel.city?.name,
        uuid: hotel.uniqueId,
      },
    }));

    return [
      cities?.length && {
        id: '1',
        title: 'شهرها',
        elementName: 'location_group_header',
        children: cities,
      },
      hotels?.length && {
        id: '2',
        title: 'هتل‌ها',
        elementName: 'location_group_header',
        children: hotels,
      },
    ].filter((a) => a) as DesktopOriginDestinationLocationsType;
  };

  const toOriginDestinationDefaultData = (
    response: DesktopOriginDestinationDataMapperInputType,
  ): DesktopOriginDestinationLocationsType => {
    const cities = (response as THotelsAndCitiesResponse)?.cities?.map((city) => ({
      id: city.cityId as string,
      title: city.name as string,
      titleEng: city.nameEng as string,
      subTitle: city.province,
      icon: <PlaceIcon className="fill-grey-2" />,
      type: {
        id: 'city',
        title: 'شهر',
      },
    }));

    return cities || [];
  };

  const isSuperApp = useIsSuperApp();

  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  const calendarOccasions = useCalendarOccasions();

  return (
    <div
      className={classNames(
        'container-xxl p-0 px-3',
        `${isSuperApp ? styles['is-superapp'] : ''}`,
        styles.main,
      )}
    >
      <div className="row flex-row-reverse g-0 pt-3">
        <div className="col-12 col-lg-4 col-md-12 px-1">
          <>
            {isMobile ? (
              <div className={styles['origin-destination']}>
                <OriginDestination
                  defaultData={{
                    title: 'شهرهای پرتردد',
                    value: toOriginDestinationDefaultData(
                      busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
                    ),
                  }}
                  state={mapToDesktopOriginDestinationState(location)}
                  onSelect={(e) => {
                    submitLocation(mapToLocationState(e));
                  }}
                  api={{
                    fetcher: getCitiesAndHotels,
                    dataMapper: desktopOriginDestinationDataMapper,
                  }}
                  history={desktopOriginDestinationHistory}
                  onClearHistory={handleDesktopOriginDestinationClearHistory}
                  originOnly
                  style="categoryTitle"
                  originPlaceHolder="شهر یا هتل (داخلی و خارجی)"
                  banEnglishInput={false}
                  inputCharsLengthToSearch={2}
                />
              </div>
            ) : (
              <>
                <DesktopOriginDestination
                  defaultData={{
                    title: 'شهرهای پرتردد',
                    value: toOriginDestinationDefaultData(
                      busiestTransportServiceProviders as DesktopOriginDestinationDataMapperInputType,
                    ),
                  }}
                  state={mapToDesktopOriginDestinationState(location)}
                  onSelect={(e) => {
                    submitLocation(mapToLocationState(e));
                  }}
                  api={{
                    fetcher: getCitiesAndHotels,
                    dataMapper: desktopOriginDestinationDataMapper,
                  }}
                  originOnly
                  history={desktopOriginDestinationHistory}
                  onClearHistory={handleDesktopOriginDestinationClearHistory}
                  originPlaceHolder="شهر یا هتل (داخلی و خارجی)"
                  banEnglishInput={false}
                  inputCharsLengthToSearch={2}
                />
              </>
            )}
          </>
        </div>
        <div className={classNames('col-12 col-lg-4 px-1 mb-1 col-md-6 my-2 my-lg-0')}>
          <DatePicker
            view={isMobile ? 'mobile' : 'desktop'}
            value={date}
            setValue={setDate}
            title={
              location.origin?.city +
              (location.origin?.type?.id === 'hotel' ? ` (${location.origin.data?.cityName}) ` : '')
            }
            range={true}
            open={activeInput === 'datepicker'}
            placeHolder={{ from: 'تاریخ ورود به هتل', to: 'تاریخ خروج از هتل' }}
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
            allowSimilarDates={false}
            occasions={calendarOccasions}
          />
        </div>
        <div className={classNames('col-12 col-md-3 col-lg-2 px-1  my-2 my-lg-0')} dir="rtl">
          <PassengerInput
            hotelPassengers={passengers}
            setHotelPassengers={setPassengers}
            showPassenger={showPassenger}
            setShowPassenger={(value) => setShowPassenger(value)}
            updateOnSubmit={true}
            onSubmit={() => {
              handlePassengerSubmit();
            }}
            hotelInputValue={passengersInputValue}
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
            loading={(searchButtonClicked && routeChangeStarted) || loadingPrepare}
            disabled={isDisable({
              originLocation: location.origin.value,
              dateFrom: date.from,
              dateTo: date.to,
            })}
          >
            جستجوی هتل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketsSearchBox;
