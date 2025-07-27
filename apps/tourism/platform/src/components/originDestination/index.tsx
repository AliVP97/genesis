import { SwapIcon, DatePickerRightArrow } from 'assets/icons';
import styles from './originDestination.module.scss';
import locationInputStyle from './locationInput.module.scss';
import LocationInput from './locationInput';
import { BottomSheet } from 'react-spring-bottom-sheet';
import LocationCard from './locationCard';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import {
  LocationType,
  DesktopOriginDestinationLocationType,
  DesktopOriginDestinationPropsType,
  // DesktopOriginDestinationStateType,
  DesktopOriginDestinationLocationsType,
  TAdditionalDataDefaultValue,
} from './interface';
import classNames from 'classnames';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useQuery } from 'react-query';
import Spinner from 'components/spinner';

const SelectOriginAndDestination = <T, D = TAdditionalDataDefaultValue>({
  // value,
  state,
  defaultData,
  // onChange,
  onSelect,
  api,
  history,
  onClearHistory,
  originOnly = false,
  skeleton,
  style = '',
  originPlaceHolder = 'انتخاب شهر مبدا',
  banEnglishInput = false,
  inputCharsLengthToSearch = 1,
  defaultQuery,
}: DesktopOriginDestinationPropsType<T, D>) => {
  /* const initialState: locationState = {
      origin: {city: '', value: '', airport: ''},
      destination: {city: '', value: '', airport: ''},
    }; */
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const serviceName = ServiceDetector();
  const [isEnableSearch, setIsEnableSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const {
    data: searchData,
    remove,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['search', { query: searchValue.trim(), ...api.params }],
    queryFn: api.fetcher,
    enabled: isEnableSearch,
    ...defaultQuery?.(searchValue.trim()),
  });

  const clearInput = () => {
    searchRef.current && (searchRef.current.value = '');
    setSearchValue('');
    setIsEnableSearch(true);
  };

  const searchStationHandler = debounce((value) => {
    setIsEnableSearch(false);
    setSearchValue(value);
    const cleanValue = value?.trim();
    if (!cleanValue.length) {
      remove();
      return;
    }
    // setSearchValue(value);
    setIsEnableSearch(cleanValue.length >= inputCharsLengthToSearch);
  }, 500);

  const handleLocationInputChange = (value: string) => {
    const valueIsEnglish = /^[A-Za-z0-9 ]*$/.test(value);
    if (valueIsEnglish && banEnglishInput) {
      clearInput();
    } else searchStationHandler(value);
  };

  const service = ServiceDetector();

  const areSameLocations = (
    location1: DesktopOriginDestinationLocationType<D>,
    location2: DesktopOriginDestinationLocationType<D>,
  ): boolean => {
    const locationTitle1 = location1.title;
    const locationTitle2 = location2.title;

    if (locationTitle1 && locationTitle2) {
      if (locationTitle1 === locationTitle2) {
        return true;
      }
    }

    /**
     * if city titles are same for both locations only for international flights
     * ignore one of them.
     */
    const locationCityTitle1 = (location1.data as { cityTitle: string })?.cityTitle;
    const locationCItyTitle2 = (location2.data as { cityTitle: string })?.cityTitle;
    if (
      service === 'international' &&
      locationCityTitle1 &&
      locationCItyTitle2 &&
      locationCityTitle1 === locationCItyTitle2
    ) {
      return true;
    }

    return false;
  };

  const handleSelectLocation = (
    // locationValue: Location,
    locationValue: DesktopOriginDestinationLocationType<D>,
    name: LocationType,
  ) => {
    if (searchRef.current?.value) {
      searchRef.current.value = '';
    }

    if (name === LocationType.ORIGIN) {
      const oppositeLocationType = originOnly ? null : LocationType.DESTINATION;
      if (
        areSameLocations(locationValue, state.destination) ||
        (state?.destination?.id && state?.destination?.id === locationValue.id)
      ) {
        onSelect({
          origin: locationValue,
          destination: {
            id: '',
            title: '',
            clicked: false,
          } as DesktopOriginDestinationLocationType<D>,
        });
        setLocationType(oppositeLocationType);
        setIsEnableSearch(false);
      } else if (
        // !state.destination.city.title.farsi ||
        !state.destination.title ||
        !state?.destination?.id
      ) {
        onSelect({ ...state, [name]: locationValue });
        setLocationType(oppositeLocationType);
        setIsEnableSearch(false);
      } else {
        const locationValueFinal = { ...locationValue, clicked: true };
        onSelect({ ...state, [name]: locationValueFinal });
        setLocationType(null);
        setIsEnableSearch(false);
      }
    } else {
      if (
        areSameLocations(locationValue, state.origin) ||
        (state.origin.id && state.origin.id === locationValue.id)
      ) {
        onSelect({
          origin: {
            id: '',
            title: '',
            clicked: false,
          } as DesktopOriginDestinationLocationType<D>,
          destination: locationValue,
        });
        setLocationType(LocationType.ORIGIN);
      } else if (!state.origin.title || !state?.origin?.id) {
        onSelect({ ...state, [name]: locationValue });
        setLocationType(LocationType.ORIGIN);
      } else {
        const locationValueFinal = { ...locationValue, clicked: true };
        onSelect({ ...state, [name]: locationValueFinal });
        setLocationType(null);
      }
    }

    remove();
    setIsEnableSearch(false);
    setSearchValue('');
  };

  const handleSelectInput = (type: LocationType) => {
    if (type === LocationType.DESTINATION && !state.origin.title)
      return setLocationType(LocationType.ORIGIN);

    setLocationType(type);
  };

  const handleChangeSide = () => {
    onSelect({ origin: state.destination, destination: state.origin });
  };
  const createLocationCards = <D,>(locations: DesktopOriginDestinationLocationsType<D>) =>
    locations?.map((location, i) => (
      // unxoun - WARNING: remove "+ i" later, it is for handling the server's mock response problems.
      <div key={location.id + i} className={styles['locations-group']}>
        <LocationCard
          inputName={locationType as LocationType}
          onSelect={handleSelectLocation}
          data={location}
          cityEng={location.titleEng}
        />
        {location.children &&
          location.children.map((child, j) => (
            <LocationCard
              key={child.id + j}
              inputName={locationType as LocationType}
              onSelect={handleSelectLocation}
              data={child}
              cityEng={location.titleEng}
            />
          ))}
      </div>
    ));

  const locationList = () => {
    const locationCardsData = api.dataMapper(searchData);

    const list = (
      <>
        {locationType &&
          history &&
          !!history[locationType].length &&
          (!searchValue || searchValue.length < inputCharsLengthToSearch) && (
            <>
              <div className={styles['history-header']}>
                <button
                  className={styles['clear-history']}
                  onClick={() => {
                    onClearHistory?.(locationType);
                  }}
                >
                  پاک کردن
                </button>
              </div>
              {history[locationType]?.map((item) => (
                <LocationCard
                  key={item.id}
                  inputName={locationType as LocationType}
                  onSelect={handleSelectLocation}
                  data={item}
                  cityEng={item.cityEng}
                />
              ))}
            </>
          )}
        {isLoading &&
          searchValue &&
          (skeleton || (
            <div className="pt-5">
              <Spinner />
            </div>
          ))}
        {searchValue && searchValue.length >= inputCharsLengthToSearch ? (
          isSuccess &&
          (locationCardsData?.length ? (
            createLocationCards(locationCardsData)
          ) : (
            <div
              className={classNames(
                styles['no-result'],
                'd-flex justify-content-center align-items-center color-grey-2',
              )}
            >
              متاسفانه نتیجه‌ای مطابق جستجوی شما پیدا نشد.
            </div>
          ))
        ) : (
          // Frequently searched results
          <>
            <h6 className={classNames('mt-3 mb-2 text-3 text-weight-400 color-grey-1')}>
              {defaultData.title}
            </h6>
            {/* {domesticBusiest.map(airport => ( */}
            {defaultData?.value?.map((location) => (
              <LocationCard
                key={location?.id}
                inputName={locationType as LocationType}
                onSelect={handleSelectLocation}
                data={location}
                cityEng={location.cityEng}
              />
            ))}
          </>
        )}
      </>
    );

    const getBottomsheetTitle = () => {
      return serviceName === 'hotel' ? (
        <div className={styles['buttomsheet-header']}>
          <div className={styles['back-button']} onClick={() => setLocationType(null)}>
            <DatePickerRightArrow fill="#b20784" />
          </div>
          <div className={styles.title}>انتخاب شهر یا هتل</div>
        </div>
      ) : locationType === LocationType.ORIGIN ? (
        'انتخاب شهر مبدا'
      ) : (
        'انتخاب شهر مقصد'
      );
    };

    return (
      <BottomSheet
        open={!!locationType}
        onDismiss={() => setLocationType(null)}
        className="bottom-sheet"
        snapPoints={({ maxHeight }) => maxHeight * 0.9}
        header={getBottomsheetTitle()}
        initialFocusRef={false}
      >
        <div className={classNames('p-3', styles[style])} dir="rtl">
          {locationType === LocationType.DESTINATION && (
            <>
              <div className={classNames(locationInputStyle.location, styles['origin-input'])}>
                <label>مبدا</label>
                <div className={classNames(locationInputStyle.location__input)}>
                  {state.origin.title}
                  {state.origin.description && `- ${state.origin.description}`}
                </div>
                <span
                  className={styles['change-origin']}
                  onClick={() => setLocationType(LocationType.ORIGIN)}
                >
                  تغییر مبدا
                </span>
              </div>
              <hr />
            </>
          )}
          <LocationInput
            inputRef={searchRef}
            onChange={handleLocationInputChange}
            name="searchInput"
            placeholder={
              serviceName == 'train'
                ? 'نام شهر، شهرستان یا ایستگاه را وارد کنید'
                : serviceName == 'bus'
                  ? `نام شهر، شهرستان یا پایانه را وارد نمایید`
                  : serviceName == 'hotel'
                    ? `نام شهر یا هتل را (داخلی و خارجی) وارد نمایید`
                    : serviceName == 'international'
                      ? `نام فرودگاه شهر یا کشور ${
                          locationType === LocationType.ORIGIN ? 'مبدا' : 'مقصد'
                        } را وارد کنید`
                      : serviceName == 'tour'
                        ? `نام شهر ${
                            locationType === LocationType.ORIGIN ? 'مبدا' : 'مقصد'
                          } را وارد نمایید`
                        : `${locationType === LocationType.ORIGIN ? 'مبدا' : 'مقصد'} (شهر، فرودگاه) `
            }
            clearButton={true}
            onClearInput={clearInput}
            className={styles['bottomsheet-location-input']}
          />
          <div className="mt-2">{list}</div>
        </div>
      </BottomSheet>
    );
  };

  return (
    <div className={styles['origin-destination']}>
      <LocationInput
        icon
        name={LocationType.ORIGIN}
        mode={originOnly ? 'default' : LocationType.ORIGIN}
        handleClick={handleSelectInput}
        style={'location__input'}
        placeholder={originPlaceHolder}
        readOnly={true}
        onChange={undefined}
        desktopValue={undefined}
      >
        {state.origin?.id && (
          <div className="text-3" role={'button'}>
            <span className="text-weight-bold color-black d-inline-block ms-2">
              {state.origin?.title}
            </span>
            {serviceName !== 'train' && (
              <span className="color-grey-1 d-inline-block">{state.origin.description}</span>
            )}
          </div>
        )}
      </LocationInput>
      {!originOnly && (
        <>
          <div className={styles['origin-destination__divider']}>
            <div />
          </div>
          <div className={styles['origin-destination__swap']} onClick={handleChangeSide}>
            <SwapIcon />
          </div>
          <LocationInput
            icon
            name={LocationType.DESTINATION}
            mode={LocationType.DESTINATION}
            handleClick={handleSelectInput}
            style={'location__input'}
            placeholder={'انتخاب شهر مقصد'}
            onChange={undefined}
            readOnly={true}
            desktopValue={undefined}
          >
            {state.destination?.id && (
              <div className="text-3" role={'button'}>
                <span className="text-weight-bold color-black d-inline-block ms-2">
                  {state.destination.title}
                </span>
                {serviceName !== 'train' && (
                  <span className="color-grey-1 d-inline-block">
                    {state.destination.description}
                  </span>
                )}
              </div>
            )}
          </LocationInput>
        </>
      )}
      {locationList()}
    </div>
  );
};
export default SelectOriginAndDestination;
