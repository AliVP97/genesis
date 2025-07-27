import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import cn from 'classnames';
import React, { useEffect } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { Info, TourIcon } from 'assets/icons';
import styles from './style.module.scss';
import Table from './components/table';
import TourOrderForm from './components/TourOrderTable';
import { multiDayOrderTableHeading } from './hooks/constant';
import { useAuthContext } from '../../../utils/hooks/useAuthContext';

type TTourCheckout = {
  detail: TTourGetCheckoutResponse;
};
const TourCheckoutContainer = ({ detail }: TTourCheckout) => {
  const { isMobile } = useDeviceDetect();
  // console.log(details, 'details');
  // const {detail} = details;

  const tableData = [
    {
      accommodation: detail?.accommodation,
      startDate: detail?.startDate,
      endDate: detail?.endDate,
      nightNo: detail?.nightNo,
      transport: detail?.transport,
      adultNo: detail?.adultNo,
      childNoWithBed: detail?.childNoWithBed,
      childNoWithoutBed: detail?.childNoWithoutBed,
      infantNo: detail?.infantNo,
      adultPriceSingle:
        detail?.adultPriceSingle && Number(detail?.adultPriceSingle)?.toLocaleString(),
      adultPriceDouble:
        detail?.adultPriceDouble && Number(detail?.adultPriceDouble)?.toLocaleString(),
      childPriceWithBed:
        detail?.childPriceWithBed && Number(detail?.childPriceWithBed)?.toLocaleString(),
      childPriceWithoutBed:
        detail?.childPriceWithoutBed && Number(detail?.childPriceWithoutBed)?.toLocaleString(),
      infantPrice: detail?.infantPrice && Number(detail?.infantPrice).toLocaleString(),
      additionalServicePrice:
        detail?.additionalServicePrice && Number(detail?.additionalServicePrice)?.toLocaleString(),
      isOneDay: detail?.isOneDay,
      tripType: detail?.tripType,
    },
  ];

  const { login, checkAuth } = useAuthContext();

  useEffect(() => {
    if (!login) {
      queueMicrotask(() => {
        if (!login) {
          checkAuth({ closable: login, visible: !login });
        }
      });
    }
  }, [login]);

  return (
    <div>
      <div dir="rtl">
        <div className={cn(!isMobile && 'container')}>
          <div className={cn(styles['tour-order-content__form'], 'mt-3')}>
            <div
              className={
                isMobile
                  ? styles['tour-order-content__title__flag']
                  : 'position-absolute col-9 d-flex align-items-center justify-content-start gap-3 ps-5 '
              }
            >
              <TourIcon />
              <span className={isMobile ? 'fw-500' : 'fw-bold'}>رزرو تور گروهی</span>
            </div>
            <div
              className={
                isMobile
                  ? styles['tour-order-content__title__info']
                  : 'position-absolute mt-4 pt-2 col-9 d-flex align-items-center justify-content-start gap-3 ps-5 '
              }
            >
              <Info />
              <span className="fs-2 color-grey-1">تمامی مبالغ به صورت ریال می باشد</span>
            </div>
            <div
              className={
                isMobile
                  ? ' d-flex justify-content-center mb-3'
                  : 'col d-flex justify-content-end my-2'
              }
            >
              <div className={cn(styles['tour-order-content__return-button'], 'mb-4')}></div>
            </div>
            <Table
              headers={multiDayOrderTableHeading}
              rows={tableData}
              tooltip="*قیمت معادل هر نفر بزرگسال در اتاق دوتخته. *قیمت ها بر اساس ریال است."
            />
          </div>
          <TourOrderForm data={tableData[0] as TTourGetCheckoutResponse} />
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
};
export default TourCheckoutContainer;
