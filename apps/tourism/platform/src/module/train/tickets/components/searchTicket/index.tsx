import React, { Dispatch, SetStateAction, useEffect } from 'react';

import classNames from 'classnames';

import Button from 'components/button';
import Checkbox from 'components/checkbox';
import DesktopOriginDestination from 'components/desktopOriginDestination';
import OriginDestination from 'components/originDestination';
import PassengerInput from 'components/passengerInput';
import { TCoupeType } from 'components/passengerInput/types';
import RadioElement from 'components/radio';
import SwitchButton from 'components/switchButton';
import DatePicker from 'containers/datepicker/selectDate';
import { TTrainStationType } from 'services/train/types';
import { useCalendarOccasions } from 'utils/hooks/useCalendarOccasions';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { isDisable, toDaysContents } from '../../helper';
import { useCalendar, useHandleSearch, useSearchBox } from './hooks';

import styles from './search-ticket.module.scss';

export type TInitialState = {
  origin: Required<TTrainStationType>;
  destination: Required<TTrainStationType>;
};

const SearchTicket = () => {
  const {
    location,
    setTrainType,
    trainType,
    coupeType,
    setCoupeType,
    date,
    setDate,
    wantCompartment,
    setWantCompartment,
    showPassenger,
    setShowPassenger,
    activeInput,
    componentProps,
  } = useSearchBox();

  const {
    calendarSystem,
    handleCalendarSystemChange,
    daysPrices,
    datepickerTitle,
    datePickerOpenHandler,
  } = useCalendar({ date, trainType, location });

  const { submitSearch, setPassengers, passengers, searchButtonClicked, setSearchButtonClicked } =
    useHandleSearch({
      location,
      trainType,
      date,
      coupeType,
      wantCompartment,
    });

  const { isMobile } = useDeviceDetect();

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
      className={classNames('container-xxl p-0 px-3', `${isSuperApp ? styles['is-superapp'] : ''}`)}
    >
      <div className="row flex-row-reverse g-0 px-1">
        <div className="col-12">
          <div className="d-flex align-items-center flex-row-reverse">
            {isMobile && (
              <div className={styles['ticket-type']}>
                <div
                  onClick={() => setTrainType('roundTrip')}
                  className={classNames(
                    styles['ticket-type__button'],
                    trainType === 'roundTrip' && styles['ticket-type__button--active'],
                  )}
                >
                  رفت و برگشت
                </div>
                <div
                  onClick={() => setTrainType('oneWay')}
                  className={classNames(
                    styles['ticket-type__button'],
                    trainType === 'oneWay' && styles['ticket-type__button--active'],
                  )}
                >
                  یک طرفه
                </div>
              </div>
            )}
            {!isMobile && isMobile !== undefined && (
              <div className="d-flex flex-row-reverse ms-auto">
                <div className="hover" role={'button'}>
                  <RadioElement
                    className="rtl"
                    checked={trainType === 'oneWay'}
                    label="یکطرفه"
                    onChange={() => setTrainType('oneWay')}
                    value="oneWay"
                  />
                </div>
                <div className="px-4 hover" role={'button'}>
                  <RadioElement
                    className="rtl"
                    checked={trainType === 'roundTrip'}
                    label="رفت و برگشت"
                    onChange={() => setTrainType('roundTrip')}
                    value="roundTrip"
                  />
                </div>
              </div>
            )}
            <div
              className=" align-items-center d-md-flex d-none"
              onClick={() => setWantCompartment(!wantCompartment)}
              role="button"
            >
              <span>کوپه دربست میخواهم</span>
              <Checkbox checked={wantCompartment} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 ps-2">
          {isMobile ? (
            <OriginDestination {...componentProps} />
          ) : (
            <DesktopOriginDestination {...componentProps} />
          )}
        </div>
        <div className={classNames('col-12 col-md-6 col-lg-4 ps-2 my-2 my-lg-0')}>
          <DatePicker
            view={isMobile ? 'mobile' : 'desktop'}
            value={date}
            setValue={setDate}
            title={datepickerTitle}
            range={trainType === 'roundTrip'}
            open={activeInput === 'datepicker'}
            onOpen={datePickerOpenHandler}
            calendarSystem={calendarSystem}
            onCalendarSystemChange={(e) => {
              handleCalendarSystemChange(e);
            }}
            daysContents={toDaysContents(daysPrices)}
            occasions={calendarOccasions}
          />
        </div>
        <div className={classNames('col-12 col-md-3 col-lg-2 my-md-2 my-lg-0')} dir="rtl">
          <PassengerInput
            trainPassenger={passengers}
            setTrainPassenger={setPassengers}
            showPassenger={showPassenger}
            setShowPassenger={(value) => setShowPassenger(value)}
            coupeType={coupeType}
            setCoupeType={setCoupeType as Dispatch<SetStateAction<TCoupeType>>}
          />
        </div>
        <div className={`col-12 mt-4 text-3 text-weight-500 d-md-none pe-3`}>
          <SwitchButton
            defaultChecked={wantCompartment}
            onChange={setWantCompartment}
            title="کوپه دربست میخواهم"
          />
        </div>

        <div
          className={classNames(
            styles.searchTicket__btn,
            'col-lg-2 px-md-3 mb-1 col-md-3 mt-3 mt-md-0 d-flex align-items-center',
          )}
        >
          <Button
            radius
            className={`btn btn-primary d-block w-100 ${styles['submit-button']}`}
            btnType="button"
            onClick={submitSearch}
            loading={searchButtonClicked && routeChangeStarted}
            disabled={isDisable({
              originLocation: location.origin.code,
              destinationLocation: location.destination.code,
              dateFrom: date.from,
              tripMode: trainType,
              dateTo: date.to,
              passenger: passengers.adult,
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
