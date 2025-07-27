import React, { FC, useEffect, useState } from 'react';
import styles from './ticket.module.scss';
import cn from 'classnames';
import { ArrowDownIcon, ArrowUpIcon, LeftArrowIcon, TrendingFlat } from 'assets/icons';
import { TicketType } from './interface';
import Image from 'next/image';
import API from 'utils/routes/api';
import { customLoader } from 'utils/helpers/imageLoader';
import { useRouteChange } from '../../../../utils/hooks/useRouteChange';
import Spinner from 'components/spinner';
import { useRouter } from 'next/router';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import defaultImage from 'public/images/default-domestic-flight.png';

interface Props {
  ticket: TicketType;
  handleClick?: (v: TicketType) => void;
  handleSelect?: (v: TicketType) => void;
  disable?: boolean;
  isOpenDetail: boolean;
  isMobile?: boolean;
  isSelected?: boolean;
  returning?: boolean;
  expandAccordion?: () => void;
}

const Ticket: FC<Props> = ({
  ticket,
  handleClick,
  handleSelect,
  disable,
  isOpenDetail,
  isMobile,
  isSelected,
  returning,
  expandAccordion,
}) => {
  const { query } = useRouter();
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [isloginStarted, setIsLoginStarted] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  const { login, setLoginModalVisible, visible } = useAuthContext();

  const handleLogin = () => {
    if (login) {
      setSearchButtonClicked(true);
      handleSelect?.(ticket);
    } else {
      setIsLoginStarted(true);
      setLoginModalVisible(true);
    }
  };
  useEffect(() => {
    if (isloginStarted && login) {
      setIsLoginStarted(false);
      setSearchButtonClicked(true);
      handleSelect?.(ticket);
    }
  }, [login]);
  useEffect(() => {
    if (!visible) {
      setIsLoginStarted(false);
    }
  }, [visible]);

  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  let ticketButtonLabel;

  if (searchButtonClicked && routeChangeStarted) {
    ticketButtonLabel = <Spinner />;
  } else if (returning) {
    ticketButtonLabel = 'انتخاب بلیط برگشت';
  } else if (query.returningDate) {
    ticketButtonLabel = 'انتخاب بلیط رفت';
  } else {
    ticketButtonLabel = 'انتخاب بلیط';
  }

  const ticketContentClass = isMobile
    ? styles.ticket__content__charter
    : styles.ticket__content__economy;

  const shouldShowRemainingSeats =
    ticket?.remainingSeats &&
    ticket?.remainingSeats <= 10 &&
    ticket?.remainingSeats > -1 &&
    ticket?.remainingSeats > 0;

  const isCapacityFull =
    ticket?.remainingSeats != null && Number(ticket?.remainingSeats) < 10 && !isSelected;

  const remainingSeatsMessage = ticket?.remainingSeats === 0 ? 'تکمیل ظرفیت' : '';

  return (
    <div className={'rounded-3'}>
      <div
        style={{ backgroundColor: isOpenDetail ? '#f2f4f7' : 'white' }}
        className={cn(
          styles.ticket,
          isOpenDetail ? 'mb-0' : 'mb-2',
          disable ? styles['ticket--disable'] : '',
          ticket?.remainingSeats === 0 ? styles['ticket__seat-full'] : '',
        )}
        onClick={() => isMobile && handleClick?.(ticket)}
      >
        {ticket?.promotion && (
          <div className="d-flex flex-row-reverse">
            <span className={cn(styles['ticket__discount-on-next-sale'], 'd-flex ')}>
              {ticket?.promotion}
              ریال تخفیف ویژه خرید بعدی
            </span>
          </div>
        )}

        <div className={cn(styles.ticket__content, 'd-flex flex-row-reverse')}>
          <div
            className={cn(
              styles.ticket__content__title,
              !isMobile ? 'col-1' : 'col-2',
              ' text-center d-flex flex-column ',
            )}
          >
            <Image
              loader={customLoader}
              src={
                ticket?.airline?.code
                  ? `${API.IMAGE_DOMAIN}airplane/${ticket.airline.code}.svg`
                  : defaultImage
              }
              alt="airline logo"
              width={isMobile ? '32px' : '40px'}
              height={isMobile ? '32px' : '40px'}
              quality={100}
              unoptimized
              objectFit="contain"
              onError={(e) => {
                e.currentTarget.src = defaultImage.src;
              }}
            />
            <span className={cn(styles['ticket__content__airline-name'], 'mt-2 d-inline-block')}>
              {ticket?.airline?.name}
            </span>
          </div>
          <div
            className={cn(
              !isMobile ? 'col-md-3 col-xl-4' : 'col-6',
              'd-flex flex-column justify-content-between align-items-center',
            )}
          >
            <div
              className={cn(styles.ticket__content__time, 'd-flex align-items-center')}
              dir="rtl"
            >
              <div>
                <span>{ticket?.departure?.dateHourString}</span>
                {isMobile && <LeftArrowIcon />}
                {!isMobile && (
                  <>
                    <TrendingFlat
                      className="mx-2 rtl"
                      style={{
                        fill: '#9e9e9e',
                        transform: 'rotate(180deg)',
                      }}
                    />
                    <p className="text-2">{ticket?.departure?.airport?.city?.name?.farsi}</p>
                  </>
                )}
              </div>
              <div>
                <span>{ticket?.arrival?.dateHourString}</span>
                {!isMobile && (
                  <p className="text-2">{ticket?.arrival?.airport?.city?.name?.farsi}</p>
                )}
              </div>
            </div>
            {isMobile && <span className="text-3 color-grey-1 en">{ticket?.airplaneModel}</span>}
          </div>
          {!isMobile && (
            <span
              className={cn(
                styles.ticket__content__airlineModel,
                'en d-flex mb-4 col-md-2 col-xl-2 justify-content-end',
              )}
            >
              {ticket?.airplaneModel}
            </span>
          )}
          <div
            className={cn('d-flex flex-column align-items-start', !isMobile ? 'col-xl-2' : 'col-4')}
          >
            <div
              className={cn(
                isMobile && 'flex-column text-center justify-content-evenly',
                'col d-flex',
              )}
            >
              <span className={styles.ticket__content__charter}>
                {ticket?.isCharter ? 'چارتری' : 'سیستمی'}
              </span>
              {ticket?.flightClass !== 'ECONOMY' ? (
                <div className={cn(styles.ticket__content__business, !isMobile && 'ms-2')}>
                  بیزینس
                </div>
              ) : (
                <div className={cn(ticketContentClass)}>اکونومی</div>
              )}
            </div>
            {!isMobile && (
              <button className={styles['ticket__content__show--detail']} onClick={expandAccordion}>
                {isOpenDetail ? <ArrowUpIcon /> : <ArrowDownIcon />}
                <span>
                  {isOpenDetail ? 'بستن جزییات پرواز' : 'مشاهده جزییات پرواز'}
                  {}
                </span>
              </button>
            )}
          </div>
          {!isMobile && (
            <>
              <div className={styles['ticket__dashed-divider']} />
              <div className="d-flex flex-column align-items-start align-items-md-center justify-content-center flex-grow-1  pe-2">
                {!isSelected && shouldShowRemainingSeats ? (
                  <div className={cn(styles.ticket__footer__availableCounts, 'col-md')}>
                    <div className="d-flex flex-row">
                      <span>صندلی باقی مانده</span>
                      <span>{ticket?.remainingSeats}</span>
                    </div>
                  </div>
                ) : (
                  isCapacityFull && <small className="fs-4 color-black">تکمیل ظرفیت</small>
                )}
                {isSelected && <span className="text-3">مجموع قیمت</span>}
                {ticket?.remainingSeats && ticket?.remainingSeats > 0 ? (
                  <div>
                    <div className={cn(styles.ticket__footer__price, 'col-md')}>
                      {' '}
                      <span className={styles.ticket__footer__price__unit}>ریال</span>
                      <span>{ticket?.price?.toLocaleString()} </span>
                    </div>
                    {ticket.fare?.title && (
                      <div className="mb-2 text-2 text-center color-grey-2">
                        {ticket.fare?.title}
                      </div>
                    )}
                  </div>
                ) : null}
                {!isSelected && ticket?.remainingSeats && ticket?.remainingSeats > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogin();
                    }}
                    className={cn(
                      styles.ticket__footer__btn,
                      'ms-1 m-md-auto',
                      searchButtonClicked &&
                        routeChangeStarted &&
                        styles['ticket__footer__btn--loading'],
                    )}
                  >
                    {ticketButtonLabel}
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>

        {isMobile && (
          <>
            <div className={styles['ticket__dashed-divider']} />
            <div
              className={cn(
                styles.ticket__footer,
                'justify-content-between d-flex align-items-' + '' + 'center',
              )}
            >
              {ticket?.remainingSeats && ticket?.remainingSeats > 0 ? (
                <div className={cn(styles.ticket__footer__price, 'col-md')}>
                  <span>{ticket?.price?.toLocaleString()} </span>
                  <span className={styles.ticket__footer__price__unit}>ریال</span>
                  {ticket.fare?.title && (
                    <div className="mt-1 text-2 text-center color-grey-2">{ticket.fare?.title}</div>
                  )}
                </div>
              ) : null}
              {shouldShowRemainingSeats ? (
                <div className={cn(styles.ticket__footer__availableCounts, 'col-md')}>
                  <span>{ticket?.remainingSeats} صندلی باقی مانده</span>
                </div>
              ) : (
                <>
                  <div />
                  <div className="color-black">{remainingSeatsMessage}</div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Ticket;
