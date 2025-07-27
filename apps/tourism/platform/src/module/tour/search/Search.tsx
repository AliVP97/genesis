import React from 'react';
import classNames from 'classnames';
import { useSearch } from './useSearch';
import { LocationInputs, TypeSwitch } from './components';
import Button from 'components/button';
import PassengerInput from 'components/passengerInput';
import styles from './Search.module.scss';

export const Search = () => {
  const {
    isSuperApp,
    tourType,
    handleChangeType,
    submitLocation,
    submitSearch,
    passengers,
    setPassengers,
    showPassenger,
    setShowPassenger,
    searchBtn,
    searchButtonClicked,
    routeChangeStarted,
    location,
  } = useSearch();

  return (
    <div
      className={classNames('container-xxl p-0 px-3', `${isSuperApp ? styles['is-superapp'] : ''}`)}
    >
      <div className="row flex-row-reverse g-0">
        <div className="col-12 px-1">
          <TypeSwitch type={tourType} onChange={handleChangeType} />
        </div>

        <div className="col-12 col-lg-6 col-md-12 px-1 ">
          <LocationInputs onSubmit={submitLocation} tourType={tourType} />
        </div>

        <div className={classNames('col-12 col-md-3 col-lg-4 px-1  my-2 my-lg-0')} dir="rtl">
          <PassengerInput
            tourPassengers={passengers}
            setTourPassengers={setPassengers}
            showPassenger={showPassenger}
            setShowPassenger={setShowPassenger}
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
            disabled={!location?.destination?.value}
          >
            جستجوی تورها
          </Button>
        </div>
      </div>
    </div>
  );
};
