import { DateIcon, InfoIcon, PassengerIcon, PlaceIcon, SwapIcon } from 'assets/icons';
import classNames from 'classnames';
import Button from 'components/button';
import { LocationType } from 'components/originDestination/interface';
import LocationInput from 'components/originDestination/locationInput';
import React from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from './unavailable.module.scss';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';

const UnavailableService = ({ title }: { title: string }) => {
  const { isMobile } = useDeviceDetect();

  const isSuperApp = useIsSuperApp();

  return (
    <>
      <div className={classNames(styles['unavailable'], 'text-3 rtl p-2 px-3')}>
        <InfoIcon className={'fill-primary ms-1'} />
        کاربر گرامی {isMobile ? <br></br> : ''}سرویس {title} به زودی در دسترس شما قرار خواهد گرفت.
      </div>

      <div
        className={classNames(
          'container-xxl p-0 px-3',
          `${isSuperApp ? styles['is-superapp'] : ''}`,
        )}
      >
        <div className="row flex-row-reverse g-0 px-1">
          <div className="col-12">
            <div className="d-flex align-items-center flex-row-reverse">
              <div className={styles['ticket-type']}>
                <div className={classNames(styles['ticket-type__button'])}>رفت و برگشت</div>

                <div
                  className={classNames(
                    styles['ticket-type__button'],
                    styles['ticket-type__button--active'],
                  )}
                >
                  یک طرفه
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 mb-1 px-1">
            {isMobile ? (
              <div className={styles['origin-destination']}>
                <LocationInput
                  icon
                  name={LocationType.ORIGIN}
                  mode={LocationType.ORIGIN}
                  style={'location__input'}
                  placeholder={'مبدا'}
                  readOnly={true}
                  onChange={undefined}
                  desktopValue={undefined}
                ></LocationInput>
                <div className={styles['origin-destination__divider']}>
                  <div />
                </div>
                <div className={styles['origin-destination__swap']}>
                  <SwapIcon />
                </div>
                <LocationInput
                  icon
                  name={LocationType.DESTINATION}
                  mode={LocationType.DESTINATION}
                  style={'location__input'}
                  placeholder={'مقصد'}
                  onChange={undefined}
                  readOnly={true}
                  desktopValue={undefined}
                ></LocationInput>
              </div>
            ) : (
              <div className={styles['main']}>
                <div className={classNames(styles['input-box'], styles['origin-box'])}>
                  <PlaceIcon className={classNames(styles['icon'])} />
                  <input name="origin" placeholder="مبدا" disabled />
                </div>
                <div className={styles['swap-button']}>
                  <SwapIcon />
                </div>
                <div className={classNames(styles['input-box'], styles['destination-box'])}>
                  <PlaceIcon className={styles['icon']} />
                  <input name="destination" placeholder="مقصد" disabled />
                </div>
              </div>
            )}
          </div>
          <div className={classNames('col-12 col-lg-4 mb-1 px-1', isMobile && 'mt-3')}>
            <div className={classNames(styles['unavailable__input'], isMobile && 'text-3')}>
              <DateIcon className={'ms-2 fill-grey-2'} />
              تاریخ رفت
            </div>
          </div>
          <div className={classNames('col-12 col-lg-2 mb-1 px-1', isMobile && 'mt-3')} dir="rtl">
            <div className={classNames(styles['unavailable__input'], isMobile && 'text-3')}>
              <PassengerIcon className={'ms-2 fill-grey-2'} />1 مسافر
            </div>
          </div>
          <div
            className={classNames(
              styles['searchTicket__btn'],
              'col-lg-2 px-1 mb-1 col-md-2 mt-2',
              !isMobile && 'd-flex align-items-center',
            )}
          >
            <Button
              radius
              className={`btn btn-primary d-block w-100 ${styles['submit-button']}`}
              btnType="button"
              disabled
            >
              جستجوی سفر
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnavailableService;
