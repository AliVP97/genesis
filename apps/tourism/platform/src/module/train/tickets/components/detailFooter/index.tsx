import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import cn from 'classnames';

import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import Checkbox from 'components/checkbox';
import Skeleton from 'components/skeleton';
import Button from 'components/button';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { TabType, TicketType, TrainTicket } from '../../interface';
import { usePriceDetail } from '../../hooks/usePriceDetail';

import styles from '../trainDetail/ticketDetail.module.scss';

interface Props {
  data: TicketType;
  activeTab?: TabType;
  onSelectTicket?: (data: TrainTicket) => void;
}

export const DetailFooter = ({
  data,
  onSelectTicket,
}: Required<Pick<Props, 'data' | 'onSelectTicket'>>) => {
  const { query } = useRouter();
  const initialChecked: boolean = query?.wantCompartment == 'true';
  const [isChecked, setIsChecked] = useState(initialChecked);
  const [showPriceDetail, setShowPriceDetail] = useState(false);
  const { priceDetailPayload, detail, priceLoading } = usePriceDetail(data as TrainTicket);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  const seatCountPlus = Number(data?.availableSeatCount) < Number(data?.compartmentCapacity);

  const availableSeatCountPlus =
    Number(data?.availableSeatCount) <
    Number(query?.adult) + Number(query?.child) + Number(query?.infant);

  useEffect(() => {
    priceDetailPayload();
  }, []);

  const handleCoupeClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);

    if (!priceLoading) {
      priceDetailPayload(event.target.checked);
    }
  };
  const handleSelectClick = () => {
    setSearchButtonClicked(true);
    onSelectTicket({ ...data, isCoupe: isChecked });
  };

  return (
    <div className={cn(styles['ticket-detail__footer'], 'p-3')}>
      <div
        className={cn(
          showPriceDetail
            ? styles['ticket-detail__footer--withPriceDetail']
            : styles['ticket-detail__footer--withoutPriceDetail'],
          'row',
        )}
      >
        {detail && !priceLoading ? (
          detail?.priceDetail?.map((item) => {
            return (
              <>
                {item.tariff == 'TARIFF_ADULT' && query.adult != '0' && (
                  <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
                    <div className="color-grey-1" dir="rtl">
                      <span className="text-3">بزرگسال</span>
                      <span className="text-2 m-1">( ۱۲ سال به بالا )</span>
                    </div>

                    <div dir="rtl" className="d-flex align-items-center">
                      <span className="color-tertiary text-weight-bold text-3 ms-1 ">
                        x {query.adult}
                      </span>
                      <span className="color-grey-1">
                        {Number(item.price).toLocaleString()} <span className="text-2">ریال</span>
                      </span>
                    </div>
                  </div>
                )}
                {item.tariff == 'TARIFF_CHILD' && query.child != '0' && (
                  <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
                    <div className="color-grey-1" dir="rtl">
                      <span className="text-3">کودک</span>
                      <span className="text-2 m-1">( ۲ تا ۱۲ سال )</span>
                    </div>

                    <div dir="rtl" className="d-flex align-items-center">
                      <span className="color-tertiary text-weight-bold text-3 ms-1">
                        x {query.child}
                      </span>
                      <span className="color-grey-1">
                        {Number(item.price).toLocaleString()}
                        {''}
                        <span className="text-2">ریال</span>
                      </span>
                    </div>
                  </div>
                )}
                {item.tariff == 'TARIFF_INFANT' && query.infant != '0' && (
                  <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
                    <div className="color-grey-1" dir="rtl">
                      <span className="text-3">نوزاد</span>
                      <span className="text-2 m-1">(10 روز تا 2 سال )</span>
                    </div>

                    <div dir="rtl" className="d-flex align-items-center">
                      <span className="color-tertiary text-weight-bold text-3 ms-1">
                        x {query.infant}
                      </span>
                      <span className="color-grey-1">
                        {Number(item.price).toLocaleString()} <span className="text-2">ریال</span>
                      </span>
                    </div>
                  </div>
                )}
                {item.tariff == 'TARIFF_EMPTY' && (
                  <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
                    <div className="color-grey-1" dir="rtl">
                      <span className="text-3">کوپه دربست</span>
                      <span className="text-2 m-1">(صندلی خالی)</span>
                    </div>

                    <div dir="rtl" className="d-flex align-items-center">
                      <span className="color-tertiary text-weight-bold text-3 ms-1">
                        x {item.count}
                      </span>
                      <span className="color-grey-1">
                        {Number(item.price).toLocaleString()} <span className="text-2">ریال</span>
                      </span>
                    </div>
                  </div>
                )}
              </>
            );
          })
        ) : (
          <Skeleton uniqueKey="trainDetails" type="trainDetails" height="100%" width="100%" rtl />
        )}
        <div className={styles['ticket-detail__divider']} />
      </div>
      <div
        onClick={() => {
          setShowPriceDetail(!showPriceDetail);
        }}
        className={styles['ticket-detail__footer__history']}
      >
        <div className="d-flex flex-row-reverse">
          <div className="col text-end">
            {showPriceDetail ? <ArrowDownIcon /> : <ArrowUpIcon />}
            مجموع قیمت
          </div>

          <div dir="rtl" className="color-primary col text-start">
            {priceLoading ? (
              <Skeleton
                uniqueKey="trainDetailsPrice"
                type="trainDetailsPrice"
                width={100}
                height={30}
              />
            ) : (
              <>
                <span className="text-5 text-weight-500">
                  {Number(detail?.totalPrice) ? Number(detail?.totalPrice).toLocaleString() : 0}
                </span>
                <span className="text-3 me-1">ریال</span>
              </>
            )}
          </div>
        </div>
        <div
          className="d-flex flex-row rtl mt-3"
          style={
            !data?.hasCompartment || seatCountPlus || availableSeatCountPlus
              ? {
                  pointerEvents: 'none',
                  opacity: '0.4',
                }
              : {}
          }
        >
          <Checkbox
            checked={isChecked}
            handleClick={(e) => {
              e.stopPropagation();
              handleCoupeClick(e as never);
            }}
          />
          <div className="d-flex flex-column">
            <div>کوپه دربست می خواهم</div>
            <div className="text-3">
              {seatCountPlus
                ? 'ظرفیت قطار کمتر از ظرفیت کوپه دربست می‌باشد.'
                : availableSeatCountPlus
                  ? 'به دلیل ظرفیت کمتر این قطار از تعداد مسافران امکان رزرو کوپه دربست وجود ندارد.'
                  : ''}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-3">
        <Button
          onClick={handleSelectClick}
          loading={priceLoading || searchButtonClicked || routeChangeStarted}
          className={cn(
            styles['ticket-detail__footer__btn'],
            'justify-content-center d-flex align-items-center text-weight-500',
          )}
        >
          انتخاب بلیط
        </Button>
      </div>
    </div>
  );
};
