import Modal from 'components/modal';
import React from 'react';
import styles from './style.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import cn from 'classnames';
import { InfoIcon } from 'assets/icons';
import Divider from 'components/divider';
import { useResetFilters } from 'utils/hooks/useResetFilters';

const ReservedModal = () => {
  const { isMobile } = useDeviceDetect();

  const { resetHotelAction } = useResetFilters();
  return (
    <Modal
      className="d-flex justify-content-center align-items-center"
      onClose={() => null}
      backdropDisable={true}
      visible={true}
    >
      <div className={cn(isMobile ? styles['modal'] : styles['desktop-modal'])}>
        <div className={styles['modal__text']}>
          <div className="d-flex align-items-center">
            <span className={cn(isMobile ? ' text-2 ' : ' text-4', 'me-1')}>اتاق رزرو شده </span>{' '}
            <InfoIcon className="fill-grey-2" />
          </div>

          <span className={cn('pt-2 rtl text-end', isMobile ? ' text-2 ' : ' text-4')}>
            متاسفانه اتاق‌های مورد نظر شما در همین فاصله توسط شخص دیگری رزرو شده است
          </span>
        </div>{' '}
        {!isMobile ? <Divider type="horizontal" className="my-2" /> : <></>}
        <div className="d-flex align-items-center">
          <button
            className={
              isMobile ? cn(styles['modal__btn'], ' text-2 px-2') : styles['desktop-modal__btn']
            }
            onClick={() => resetHotelAction()}
          >
            بازگشت به صفحه نتایج{' '}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReservedModal;
