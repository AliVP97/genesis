import LocationInput from 'components/originDestination/locationInput';
import {
  DesktopOriginDestinationLocationType,
  LocationType,
} from 'components/originDestination/interface';
import LocationCard from 'components/originDestination/locationCard';
import classNames from 'classnames';
import { BottomSheet } from 'react-spring-bottom-sheet';
import locationInputStyle from 'components/originDestination/locationInput.module.scss';
import { useLocationInputs } from './useLocationInputs';
import React, { useEffect, useRef, useState } from 'react';
import styles from 'components/originDestination/originDestination.module.scss';
import { TLocationType } from '../../types';
import { useLocationSearch } from 'services/tour/v2';

interface Props {
  tourType: string;
  onSubmit: (state: TLocationType) => void;
}
const MobileLocationInput = ({ tourType, onSubmit }: Props) => {
  const [locationType, setLocationType] = useState<string | null>(null);
  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [searchInput, setSearchInput] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: result, isLoading } = useLocationSearch(
    tourType,
    locationType?.toUpperCase() || '',
    searchInput,
  );
  const clearInput = () => {
    if (searchRef.current) {
      searchRef.current.value = '';
      setSearchInput('');
    }
  };

  const handleLocationInputChange = (e: string) => {
    setSearchInput(e);
  };
  const handleSelectInput = (e: string) => {
    setLocationType(e);
  };
  const { defaultDataDestination, defaultDataOrigin } = useLocationInputs({
    tourType,
  });

  const handleSelectLocation = (
    locationValue: DesktopOriginDestinationLocationType,
    name: LocationType,
  ) => {
    if (name === LocationType.ORIGIN) {
      setOriginValue(locationValue.title);
      onSubmit({
        origin: {
          city: locationValue.title,
          value: locationValue.description as string,
        },
      });
      if (destinationValue) {
        setLocationType(null);
      } else {
        setLocationType('destination');
      }
    } else {
      setDestinationValue(locationValue.title);
      onSubmit({
        destination: {
          city: locationValue.title,
          value: locationValue.description as string,
        },
      });
      if (originValue) {
        setLocationType(null);
      } else {
        setLocationType('origin');
      }
    }
    clearInput();
  };

  useEffect(() => {
    setDestinationValue('');
    setOriginValue('');
  }, [tourType]);
  const locationList = () => {
    const data = locationType === 'origin' ? result?.origin : result?.destination;

    const dataToMap = isLoading
      ? []
      : data
        ? data.map((item) => ({
            title: item.persianName,
            description: item.englishName,
            subtitle: item.isoCode,
          }))
        : locationType === 'origin'
          ? (defaultDataOrigin?.value ?? [])
          : locationType === 'destination'
            ? (defaultDataDestination?.value ?? [])
            : [];
    const list = (
      <>
        <>
          {!searchInput && (
            <h6 className={classNames('mt-3 mb-2 text-3 text-weight-400 color-grey-1')}>
              شهرهای پرتردد
            </h6>
          )}

          {dataToMap.length ? (
            dataToMap?.map((location) => (
              <LocationCard
                inputName={locationType as LocationType}
                onSelect={handleSelectLocation}
                key={location?.description}
                data={location as DesktopOriginDestinationLocationType}
              />
            ))
          ) : (
            <div className="text-center py-5">
              {!isLoading && (
                <>
                  <p className="mt-5 color-grey-1" style={{ whiteSpace: 'pre-line' }}>
                    متاسفانه نتیجه‌ای مطابق جستجوی شما پیدا نشد.
                  </p>
                </>
              )}
            </div>
          )}
        </>
      </>
    );

    const getBottomSheetTitle = () => {
      return locationType === LocationType.ORIGIN ? 'انتخاب شهر مبدا' : 'انتخاب شهر مقصد';
    };

    return (
      <BottomSheet
        open={!!locationType}
        onDismiss={() => setLocationType(null)}
        className="bottom-sheet"
        snapPoints={({ maxHeight }) => maxHeight * 0.9}
        header={getBottomSheetTitle()}
        initialFocusRef={false}
      >
        <div className={classNames('p-3')} dir="rtl">
          {locationType === LocationType.DESTINATION && originValue && (
            <>
              <div className={classNames(locationInputStyle.location, styles['origin-input'])}>
                <label>مبدا</label>
                <div className={classNames(locationInputStyle.location__input)}>{originValue}</div>
                <span
                  className={styles['change-origin']}
                  onClick={() => {
                    setLocationType(LocationType.ORIGIN);
                    clearInput();
                  }}
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
            placeholder={`نام شهر ${
              locationType === LocationType.ORIGIN ? 'مبدا ' : 'مقصد '
            }را وارد نمایید`}
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
    <>
      <LocationInput
        icon
        name={'origin'}
        placeholder={'مبدا'}
        mode={'origin'}
        readOnly={true}
        onChange={undefined}
        handleClick={handleSelectInput}
      >
        {originValue}
      </LocationInput>
      <LocationInput
        icon
        name={'destination'}
        placeholder={'مقصد'}
        mode={'destination'}
        readOnly={true}
        onChange={undefined}
        handleClick={handleSelectInput}
      >
        {destinationValue}
      </LocationInput>
      {locationList()}
    </>
  );
};
export default MobileLocationInput;
