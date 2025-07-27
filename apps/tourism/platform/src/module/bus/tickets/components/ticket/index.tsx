import React, { FC, useEffect, useState } from 'react';
import styles from './ticket.module.scss';
import cn from 'classnames';
import { ArrowDownIcon, ArrowUpIcon, ArrowLeftIcon2 } from 'assets/icons';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { BusInfo } from 'services/bus/tickets/interface';
import Spinner from 'components/spinner';
import { useRouteChange } from 'utils/hooks/useRouteChange';

interface Props {
  ticket: BusInfo;
  disable?: boolean;
  isMobile?: boolean;
  isOpenDetail: boolean;
  expandAccordion?: () => void;
  handleClick?: (v: BusInfo) => void;
  isSelected?: boolean;
  handleSelect?: (v: BusInfo) => void;
}

const Ticket: FC<Props> = ({
  ticket,
  handleClick,
  isOpenDetail,
  isMobile,
  expandAccordion,
  handleSelect,
  isSelected,
}) => {
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  return (
    <div
      className={cn(
        styles['ticket'],
        isOpenDetail && styles['ticket--open-detail'],
        ticket?.remainingSeats === 0 && styles['ticket--disable'],
        isMobile && styles['mobile'],
      )}
      onClick={() => isMobile && handleClick?.(ticket)}
    >
      <div className={cn(styles['ticket__container'])}>
        <div className={styles['ticket__container__specification']}>
          <div className={styles['ticket__container__specification__header']}>
            {/* TODO add discount here */}
            {false && (
              <div className={styles['ticket__container__specification__header__discount']}>
                200,000 تومان تخفیف ویژه خرید بعدی
              </div>
            )}
            {ticket?.refundable === false && !isMobile && (
              <span className={styles['ticket__container__no-refund']}>غیرقابل استرداد</span>
            )}
          </div>
          <div className={styles['ticket__container__content']}>
            <div className={cn(styles['ticket__container__content__title'])}>
              {ticket?.logo && (
                <div className={styles['ticket__container__content__title__logo']}>
                  <Image
                    loader={customLoader}
                    src={ticket?.logo}
                    alt="train logo"
                    width={isMobile ? '28px' : '40px'}
                    height={isMobile ? '28px' : '40px'}
                    quality={100}
                    unoptimized
                  />
                </div>
              )}
              <span className={styles['ticket__container__content__title__name']}>
                {ticket?.companyName}
              </span>
            </div>
            <div className={styles['ticket__container__content__stations']}>
              <span>{ticket?.departureHourString}</span>
              <div className={styles['ticket__container__content__stations__departure-locations']}>
                <div
                  className={cn(
                    styles['ticket__container__content__stations__departure-locations__station'],
                    styles['origin'],
                  )}
                >
                  <div className={styles['city']}>{ticket?.originCity}</div>
                  <div className={styles['station']}>{ticket?.originStation || '-'}</div>
                </div>
                <span>
                  <ArrowLeftIcon2 />
                </span>
                <div
                  className={
                    styles['ticket__container__content__stations__departure-locations__station']
                  }
                >
                  <div className={styles['city']}>{ticket?.destinationCity}</div>
                  <div className={styles['station']}>{ticket?.destinationStation || '-'}</div>
                  {ticket?.finalDestinationCity && !isMobile && (
                    <div className={styles['final-destination-city']}>
                      مقصد نهایی:
                      <br />
                      {ticket?.finalDestinationCity}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles['ticket__container__content__description']}>
              {ticket?.busName}
            </div>
            {ticket?.finalDestinationCity && isMobile && (
              <div className={styles['final-destination-city']}>
                مقصد نهایی: {ticket?.finalDestinationCity}
              </div>
            )}
          </div>
          <div className={styles['ticket__container__specification__footer']}>
            <button
              className={styles['ticket__container__content__description__show--detail']}
              onClick={expandAccordion}
            >
              <span>{isOpenDetail ? ' بستن جزئیات' : ' مشاهده جزئیات'}</span>
              {isOpenDetail ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </button>
          </div>
        </div>
        <div className={styles['ticket__container__divider']}>
          <div className={styles['ticket__container__divider__dashed-divider']} />
        </div>
        <div
          className={cn(
            styles['ticket__container__state'],
            ticket?.remainingSeats === 0 && styles['ticket__container__state--full'],
            ticket?.remainingSeats === undefined && styles['ticket__container__state--price-only'],
          )}
        >
          {(ticket?.remainingSeats || ticket?.remainingSeats === 0) && (
            <div
              className={cn(
                styles['ticket__container__state__availableCounts'],
                Number(ticket?.remainingSeats) <= 10 &&
                  ticket?.remainingSeats !== 0 &&
                  styles['ticket__container__state__availableCounts--warning'],
                ticket?.remainingSeats === 0 &&
                  styles['ticket__container__state__availableCounts--full'],
              )}
            >
              <span>
                {ticket?.remainingSeats === 0
                  ? 'تکمیل ظرفیت'
                  : `${ticket?.remainingSeats} صندلی باقی‌مانده`}
              </span>
              {ticket?.refundable === false && isMobile && ticket?.remainingSeats !== 0 && (
                <span className={styles['ticket__container__no-refund']}>غیرقابل استرداد</span>
              )}
            </div>
          )}
          <div className={styles['ticket__container__state__footer']}>
            <div className={styles['ticket__container__state__footer__price']}>
              <span>{Number(ticket?.finalPrice)?.toLocaleString()}</span>
              <span className={styles['ticket__container__state__footer__price__unit']}>ریال</span>
            </div>
            {!isSelected && ticket?.remainingSeats !== 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchButtonClicked(true);
                  handleSelect?.(ticket);
                }}
                className={cn(
                  styles['ticket__container__state__footer__btn'],
                  searchButtonClicked &&
                    routeChangeStarted &&
                    styles['ticket__container__state__footer__btn--loading'],
                )}
              >
                {searchButtonClicked && routeChangeStarted ? <Spinner /> : <> انتخاب بلیط</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
