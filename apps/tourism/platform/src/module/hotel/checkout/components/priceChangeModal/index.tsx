import Modal from 'components/modal';
import React, { Dispatch } from 'react';
import styles from './priceChangeModal.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import cn from 'classnames';
import { InfoIcon } from 'assets/icons';
import Divider from 'components/divider';
import { useResetFilters } from 'utils/hooks/useResetFilters';

type Props = {
  newPrice: string;
  setConfirmed: Dispatch<boolean>;
};
const PriceChangeModal = ({ newPrice, setConfirmed }: Props) => {
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
            <span className={cn(isMobile ? ' text-2 ' : ' text-4', 'me-1')}>تغییر قیمت </span>{' '}
            <InfoIcon className="fill-grey-2" />
          </div>

          <span className={cn('pt-2 rtl text-end', isMobile ? ' text-2 ' : ' text-4')}>
            مبلغ واچر به دلیل تغییرات قیمت از سمت تامین کننده تغییر کرده است. در صورت تایید، بلیط با
            مبلغ جدید محاسبه میشود.{' '}
          </span>
        </div>{' '}
        {!isMobile ? <Divider type="horizontal" className="mt-4" /> : <></>}
        <div className="color-primary align-items-center text-weight-500 py-3 d-flex w-100  rtl ">
          <div className={cn(isMobile ? ' text-2 col-6 text-end ' : 'text-3 ps-2 col-6')}>
            مبلغ جدید:
          </div>
          <div className={cn(isMobile ? 'text-5 col-6 text-start' : 'text-5 col-6 text-start')}>
            {Number(newPrice).toLocaleString()}ریال
          </div>
        </div>
        {!isMobile ? <Divider type="horizontal" className="my-2" /> : <></>}
        <div
          className={cn(isMobile && 'justify-content-evenly w-100', 'd-flex align-items-center')}
        >
          <button
            className={
              isMobile
                ? cn(styles['modal__btn'], 'col-4 text-2 w-auto w-75 px-2')
                : styles['desktop-modal__btn']
            }
            style={{}}
            onClick={() => {
              setConfirmed(true);
            }}
          >
            ادامه با مبلغ جدید{' '}
          </button>
          <div
            className={cn(
              isMobile
                ? ' text-center text-2 col-8 w-auto'
                : 'col-3 text-center justify-content-center',
              !isMobile && styles['desktop-modal__return-btn'],
            )}
            onClick={() => {
              resetHotelAction();
            }}
          >
            بازگشت به صفحه نتایج{' '}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PriceChangeModal;
