import Modal from 'components/modal';
import React, { useEffect } from 'react';
import router from 'next/router';
import styles from './expireModal.module.scss';
import { removeCookie } from 'utils/helpers/coockieHelper';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useResetFilters } from 'utils/hooks/useResetFilters';
import classNames from 'classnames';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import timeOut2 from 'public/images/timeout2.png';
import WEB from 'utils/routes/web';

const ExpireModal = () => {
  const { uuidExpired, reserveExpired, checkExpiry } = useExpireContext();
  const { isMobile } = useDeviceDetect();
  const service = ServiceDetector();
  const {
    resetFlightAction,
    resetTrainAction,
    resetBusAction,
    resetHotelAction,
    resetInternationalAction,
  } = useResetFilters();

  useEffect(() => {
    if (uuidExpired) {
      const lastSearch = localStorage.getItem(
        service === 'flights'
          ? 'last_search'
          : service === 'international'
            ? 'international_flight_last_search'
            : service + '_last_search',
      );
      if (!lastSearch) {
        if (['flights', 'train', 'bus', 'international'].includes(service)) {
          removeCookie('uuid');
          localStorage.removeItem('reserve_expiry');
          checkExpiry({ type: 'uuid', expired: false });
          router.replace(service === 'flights' ? '/' : '/' + service);
        }
      }
    }
  }, [uuidExpired]);

  const displayExpireModalText = () => {
    switch (service) {
      case 'flights':
        return (
          <>
            <p className={`fw-bold ${!isMobile ? 'text-6' : 'text-4'}`}>جستجوی خود را بروز کنید.</p>
            قیمت و ظرفیت نتایج ممکن است معتبر نباشد.
            <br />
            برای اطمینان از نمایش بروزترین نتایج لطفا مجددا جستجو کنید.
          </>
        );
      case 'hotel':
        return 'جهت اطمینان از بروز بودن ظرفیت اتاق ها، نتایج خود را بروزرسانی نمایید.';
      default:
        return 'متاسفانه مدت زمان تکمیل فرایند خرید به اتمام رسیده است.\n لطفا جستجوی خود را بروز کنید.';
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem('reserve_expiry');
    removeCookie('uuid');
    checkExpiry({
      type: uuidExpired ? 'uuid' : 'reserve',
      expired: false,
    });

    if (router.pathname.startsWith('/hotel')) {
      router.push('/hotel');
      return;
    }

    if (!router.pathname.startsWith('/international')) {
      const serviceName = service.split('/')[0];
      router.push(serviceName === 'flights' ? '/' : '/' + serviceName);
      return;
    }

    router.push(WEB.INTERNATIONAL);
  };

  return (
    <Modal
      className="d-flex justify-content-center align-items-center"
      onClose={() => null}
      backdropDisable={true}
      visible={uuidExpired || reserveExpired}
    >
      <div className={classNames(isMobile ? styles['modal'] : styles['desktop-modal'])}>
        <div className={isMobile ? styles['modal__image'] : styles['desktop-modal__image']}>
          <Image
            loader={customLoader}
            src={timeOut2}
            alt="no search found"
            width="120"
            height="120"
            unoptimized
          />
        </div>
        <div className={styles['modal__text']}>
          <span className={`${!isMobile ? 'text-5' : ''} mt-3 rtl px-2 fw-normal`}>
            {displayExpireModalText()}
          </span>
        </div>
        <div
          className={classNames(
            'd-flex justify-content-evenly pt-4 align-items-center',
            isMobile ? 'flex-column' : '',
          )}
        >
          <button
            className={isMobile ? styles['modal__btn'] : styles['desktop-modal__btn']}
            onClick={
              service.includes('flights')
                ? resetFlightAction
                : service.includes('train')
                  ? resetTrainAction
                  : service.includes('international')
                    ? resetInternationalAction
                    : service.includes('hotel')
                      ? resetHotelAction
                      : resetBusAction
            }
          >
            {service === 'flights' ? 'بروز‌رسانی جستجو' : 'بروز‌رسانی مجدد'}
          </button>
          <div
            className={classNames(
              'color-grey-1 text-center text-3',
              !isMobile && styles['desktop-modal__return-btn'],
            )}
            onClick={handleBackToHome}
          >
            بازگشت به صفحه اصلی{' '}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExpireModal;
