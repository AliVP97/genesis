import React, { FC, useEffect, useState } from 'react';
import styles from './ticket.module.scss';
import cn from 'classnames';
import { ArrowDownIcon, ArrowUpIcon, LeftArrowIcon, TrendingFlat } from 'assets/icons';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { PersianWagonType, TicketType, TrainTicket, WagonType } from '../../interface';
import { TrainOrder } from 'services/train/orders/interface';
import { getTrainTripTotalPrice } from 'module/train/checkout/helper';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import Spinner from 'components/spinner';

interface Props {
  order?: TrainOrder;
  ticket: TicketType;
  handleClick?: (v: TicketType) => void;
  handleSelect?: (v: TrainTicket) => void;
  disable?: boolean;
  isOpenDetail: boolean;
  isMobile?: boolean;
  isSelected?: boolean;
  returning?: boolean;
  isCoupe?: boolean;
  expandAccordion?: () => void;
  totalPrice?: string;
}

const Ticket: FC<Props> = ({
  order,
  ticket,
  handleClick,
  handleSelect,
  isOpenDetail,
  isMobile,
  isSelected,
  returning,
  isCoupe,
  expandAccordion,
  totalPrice,
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
        isOpenDetail ? 'mb-0' : 'mb-2',
        ticket.availableSeatCount === 0 ? styles['ticket--disable'] : '',
      )}
      onClick={() => isMobile && handleClick?.(ticket)}
    >
      <div className={cn(styles['ticket__content'], 'd-flex flex-row-reverse')}>
        <div
          className={cn(
            styles['ticket__content__title'],
            !isMobile ? 'col-1' : 'col-2',
            ' text-center d-flex flex-column ',
          )}
        >
          <Image
            loader={customLoader}
            src={`${ticket?.logoUrl}`}
            alt="train logo"
            width={isMobile ? '32px' : '40px'}
            height={isMobile ? '32px' : '40px'}
            quality={100}
            unoptimized
          />
          <span className={cn(styles['ticket__content__name'], 'd-inline-block')}>
            {ticket.companyName}{' '}
          </span>
        </div>
        <div
          className={cn(
            !isMobile ? 'col-3' : 'col-5 me-3',
            'd-flex flex-column justify-content-between align-items-end',
          )}
        >
          <div className={cn(styles['ticket__content__time'], 'd-flex align-items-center rtl')}>
            <div>
              {isMobile ? (
                <div className="d-flex align-items-center">
                  <span>{ticket.departureDateHourString}</span> <LeftArrowIcon />
                  <div>
                    <span>{ticket.arrivalDateHourString}</span>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <div className="d-flex flex-column">
                    <span> {ticket.departureDateHourString}</span>
                    <span className="text-2 color-purple-brown">{ticket.originName}</span>
                  </div>
                  <TrendingFlat
                    className="mx-2 rtl "
                    style={{
                      fill: '#9e9e9e',
                      transform: 'rotate(180deg)',
                    }}
                  />
                  <div>
                    <div className="d-flex flex-column">
                      <span> {ticket.arrivalDateHourString}</span>
                      <span className="text-2 color-purple-brown">{ticket.destinationName}</span>
                    </div>{' '}
                  </div>
                </div>
              )}
            </div>
          </div>
          {isMobile && <span className="text-3 rtl">{ticket.wagonName} </span>}
          {isMobile && (
            <span className="text-3 d-flex">
              {ticket.trainOptions?.map((item) => (
                <div className={'ms-1'} key={item.code}>
                  <Image
                    loader={customLoader}
                    src={`${item.iconUrl}`}
                    alt="train logo"
                    width="16px"
                    height="15px"
                    quality={100}
                    unoptimized
                  />
                </div>
              ))}
            </span>
          )}
        </div>
        {!isMobile && (
          <div className="text-3 color-grey-1  d-flex flex-column align-items-end align-self-center col-3 ">
            <p className="rtl">{ticket.wagonName}</p>
            <span className="color-black text-2">
              {PersianWagonType[ticket.wagonType as WagonType]}
              <div className={'rtl d-flex mt-2'}>
                {ticket.trainOptions?.map((item) => (
                  <div className={'ms-2'} key={item.code}>
                    <Image
                      loader={customLoader}
                      src={`${item.iconUrl}`}
                      alt="train logo"
                      width="20px"
                      height="18px"
                      quality={100}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </span>
          </div>
        )}
        <div
          className={cn(
            'd-flex flex-column',
            !isMobile ? 'col-2 align-self-end' : 'col-4 align-items-start',
          )}
        >
          {isMobile && (
            <div className={cn(isMobile && 'flex-column ', 'col d-flex pt-2')}>
              <span className="color-grey-1 text-2">
                {PersianWagonType[ticket.wagonType as WagonType]}{' '}
              </span>
            </div>
          )}
          {!isMobile && (
            <div className="">
              <button className={styles['ticket__content__show--detail']} onClick={expandAccordion}>
                {isOpenDetail ? (
                  <>
                    <ArrowUpIcon />
                    <span className="text-2"> بستن جزئیات</span>
                  </>
                ) : (
                  <>
                    <ArrowDownIcon />
                    <span className="text-2"> مشاهده جزئیات</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        {!isMobile && (
          <>
            <div className={styles['ticket__dashed-divider']} />
            <div className="d-flex flex-column align-items-center col-3 ">
              {!isSelected && ticket.availableSeatCount && ticket.availableSeatCount <= 10 ? (
                <div className={cn(styles['ticket__footer__availableCounts'], 'col-md color-red')}>
                  <span>{ticket.availableSeatCount}صندلی باقی مانده</span>
                </div>
              ) : ticket.availableSeatCount === 0 ? (
                <div
                  className={cn(
                    styles['ticket__footer__availableCounts'],
                    'col-md d-flex align-items-center justify-content-center',
                  )}
                >
                  <span className="fs-4 color-black">تکمیل ظرفیت</span>
                </div>
              ) : (
                !isSelected && (
                  <div
                    className={cn(styles['ticket__footer__availableCounts'], 'col-md color-grey-1')}
                  >
                    <span>{ticket.availableSeatCount} صندلی باقی مانده</span>
                  </div>
                )
              )}
              {isSelected && <span className="text-3">مجموع قیمت</span>}
              {ticket.availableSeatCount !== 0 ? (
                <div className="pe-3">
                  <div className={cn(styles['ticket__footer__price'], 'col-md')}>
                    <span>
                      {isSelected &&
                      order &&
                      order?.trips?.[0].trainInfo?.priceDetail &&
                      order?.trips?.[0].trainInfo?.priceDetail!.length > 0 ? (
                        <>
                          {' '}
                          <div className="d-flex align-items-center">
                            {getTrainTripTotalPrice(order, ticket)?.toLocaleString()}
                            <span className={styles['ticket__footer__price__unit']}>ریال</span>
                          </div>
                        </>
                      ) : !isSelected ? (
                        ticket?.discountPercent && ticket?.discountPercent != '0' ? (
                          <div className="d-flex flex-column">
                            <div className="d-flex">
                              <div className={styles['ticket__footer__price__discount']}>
                                %{ticket?.discountPercent && ticket?.discountPercent}
                              </div>
                              <div className={styles['ticket__footer__price__withDiscount']}>
                                <span>{Number(ticket.fullPrice)?.toLocaleString()}</span>{' '}
                                <span className={styles['ticket__footer__price__unit']}>ریال</span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              {Number(ticket.fare)?.toLocaleString()}{' '}
                              <span className={styles['ticket__footer__price__unit']}>ریال</span>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            {Number(ticket.fare)?.toLocaleString()}
                            <span className={styles['ticket__footer__price__unit']}>ریال</span>
                          </div>
                        )
                      ) : (
                        <div className="d-flex align-items-center">
                          {Number(totalPrice)?.toLocaleString()}
                          <span className={styles['ticket__footer__price__unit']}>ریال</span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              ) : null}

              {!isSelected && ticket.availableSeatCount !== 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchButtonClicked(true);
                    handleSelect?.({ ...ticket, isCoupe: isCoupe || false });
                  }}
                  className={cn(
                    styles['ticket__footer__btn'],
                    searchButtonClicked &&
                      routeChangeStarted &&
                      styles['ticket__footer__btn--loading'],
                  )}
                >
                  {searchButtonClicked && routeChangeStarted ? (
                    <Spinner />
                  ) : returning ? (
                    'انتخاب بلیط برگشت'
                  ) : (
                    'انتخاب بلیط رفت'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {isMobile && (
        <>
          <div className={styles['ticket__dashed-divider']} />
          <div
            className={cn(
              styles['ticket__footer'],
              'justify-content-between d-flex align-items-center',
            )}
          >
            <div
              className={cn(
                styles['ticket__footer__price'],
                'col-md',
                ticket?.discountPercent && ticket?.discountPercent != '0' && 'd-flex flex-column',
              )}
            >
              {ticket?.discountPercent && ticket?.discountPercent != '0' ? (
                <div className="d-flex">
                  <div className={styles['ticket__footer__price__discount']}>
                    %{ticket?.discountPercent && ticket?.discountPercent}
                  </div>
                  <div className={styles['ticket__footer__price__withDiscount']}>
                    <span>{Number(ticket.fullPrice)?.toLocaleString()}</span>{' '}
                    <span className={styles['ticket__footer__price__unit']}>ریال</span>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {ticket.availableSeatCount !== 0 ? (
                <div>
                  <span>{Number(ticket.fare)?.toLocaleString()} </span>
                  <span className={styles['ticket__footer__price__unit']}>ریال</span>
                </div>
              ) : null}
            </div>
            {ticket.availableSeatCount && ticket.availableSeatCount <= 10 ? (
              <div className={cn(styles['ticket__footer__availableCounts'], 'col-md color-red')}>
                <span>{ticket.availableSeatCount}صندلی باقی مانده</span>
              </div>
            ) : ticket.availableSeatCount === 0 ? (
              <div className={cn(styles['ticket__footer__availableCounts'], 'col-md')}>
                <span className="color-black">تکمیل ظرفیت</span>
              </div>
            ) : (
              <div className={cn(styles['ticket__footer__availableCounts'], 'col-md color-grey-1')}>
                <span>{ticket.availableSeatCount} صندلی باقی مانده</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Ticket;
