import React from 'react';
import { content } from 'module/visa/content';
import { useRouter } from 'next/router';
import cn from 'classnames';
import styles from '../dubaiVisa.module.scss';
import VisaPriceTableDubai from './visaPriceTableDubai';
import VisaPriceTableRussia from './visaPriceTableRussia';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const VisaPriceTable = () => {
  const { query } = useRouter();
  const { isMobile } = useDeviceDetect();
  return (
    <>
      {query.name === 'russia' ? (
        <div className={styles['visa-detail-container__price']}>
          <span className="fw-bold fs-4 py-1 color-on-surface">هزینه صدور ویزای روسیه</span>
          <div className={cn(styles['visa-detail-container__divider'], 'my-3')} />
          <div className={cn(isMobile && styles['visa-detail-container__price__card'])}>
            <div className="pt-2">
              <VisaPriceTableRussia price={content.visaPriceTableRussia} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles['visa-detail-container__price']}>
          <span className="fw-bold fs-4 py-1 color-on-surface">هزینه صدور ویزای دبی</span>
          <div className={cn(styles['visa-detail-container__divider'], 'my-3')} />
          <div className={cn(isMobile && styles['visa-detail-container__price__card'])}>
            <div className={cn(isMobile && styles['visa-detail-container__price__card__title'])}>
              <span className={cn(!isMobile && 'fs-3 fw-bold py-3 pe-3 color-on-surface')}>
                هزینه اخذ ویزا بزرگسال
              </span>
            </div>
            <VisaPriceTableDubai price={content.visaPriceTableDubai} />
          </div>
          <div className={cn(isMobile && styles['visa-detail-container__price__card'])}>
            <div className={cn(isMobile && styles['visa-detail-container__price__card__title'])}>
              <span className={cn(!isMobile && 'fs-3 fw-bold py-3 pe-3 color-on-surface')}>
                هزینه اخذ ویزا زیر ۱۸ سال
              </span>
            </div>
            <VisaPriceTableDubai price={content.visaUnderAgePriceTable} />
          </div>
          <div className={cn(isMobile && styles['visa-detail-container__price__card'])}>
            <div className={cn(isMobile && styles['visa-detail-container__price__card__title'])}>
              <span className={cn(!isMobile && 'fs-3 fw-bold py-3 pe-3 color-on-surface')}>
                هزینه تمدید ویزا دبی (بزرگسال یا کودک)
              </span>
            </div>
            <VisaPriceTableDubai price={content.renewalFee} />
          </div>
        </div>
      )}
    </>
  );
};

export default VisaPriceTable;
