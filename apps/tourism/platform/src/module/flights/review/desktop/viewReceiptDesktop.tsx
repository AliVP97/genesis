import { OrderPassenger, OrderTicket } from 'services/domestic/orders/interface';
import styles from './viewReceiptDesktop.module.scss';
import cn from 'classnames';
import {
  AirplaneTicket,
  FlightLanding,
  FlightTakeOff,
  LuggageIcon,
  SeatLegroomIcon,
  SupportIcon,
} from 'assets/icons';
import { rowDetail } from './helper';
import { orderTicketData } from 'module/flights/receipt/helper';
import Divider from 'components/divider';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import API from 'utils/routes/api';
import React from 'react';
import defaultImage from 'public/images/default-domestic-flight.png';

interface Props {
  passenger: OrderPassenger;
  detail: OrderTicket;
}

const ViewReceiptDesktop = ({ passenger, detail }: Props) => {
  const data = orderTicketData(detail, passenger);
  return (
    <div className={cn(styles.receipt, 'mb-4 d-flex')}>
      <div className={cn(styles.receipt__detail, 'rtl p-0 mt-0 flex-column col-2 d-flex')}>
        <div
          className={cn(styles['receipt__detail--header'], 'row m-0 bg-color-primary color-white')}
        >
          www.780.ir
        </div>
        <div className={styles.receipt__detail__content}>
          <div className={styles['receipt__detail--rows']}>
            {rowDetail({
              label: 'نام مسافر ( لاتین )',
              data: `${data?.passengerEnglishFName + ' ' + data?.passengerEnglishLName}`,
            })}
            {rowDetail({
              label: 'نام مسافر',
              data: `${data?.name + ' ' + data?.lastname}`,
            })}
            {rowDetail({ label: 'نوع مسافر', data: data?.age })}
            {rowDetail({ label: 'کد ملی', data: data?.nationalCode })}
          </div>
        </div>
      </div>
      <Divider className={styles['receipt__detail--divider']} style="dashed" type="vertical" />
      <div className={cn(styles.receipt__content, 'rtl p-0 mt-0 col-10 position-relative')}>
        <div className={cn(styles.receipt__header, 'row m-0 bg-color-primary color-white')}>
          <div className="col-6 text-end">
            <SupportIcon />
            <span className={`${styles.receipt__content__backup} pe-2`}>
              پشتیبانی مشتریان: 4780-021
            </span>
          </div>
          <div className="col-6 d-flex justify-content-end align-items-center">
            <div className="text-2 px-1">
              <span>شماره سفارش : </span>
              <span>{data?.orderNumber}</span>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <div className={cn(styles.receipt__wrapper, 'position-relative col-10')}>
            <div className={cn(styles.receipt__wrapper__ticketInfo, 'w-100 mt-0 mb-0 mx-auto ')}>
              <div className={cn(styles.receipt__wrapper__ticketInfo__item, 'row')}>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketInfo__item__content,
                    'd-flex col-4 text-end ',
                  )}
                >
                  <div className="col-12">
                    <FlightTakeOff />
                    <span className="color-grey-1">مبدا</span>
                  </div>
                  <div className="col-12 pt-2">{data?.departureCity}</div>
                  <div className="col-12">{data?.departureCityEnglish}</div>
                </div>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketInfo__item__content,
                    'd-flex col-4 text-center',
                  )}
                >
                  <div className={'col-12 color-primary'}>شماره پرواز</div>
                  <div className="col-12 color-primary text-weight-500 pt-2 text-5">
                    {data?.flightNumber}
                  </div>
                </div>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketInfo__item__content,
                    'd-flex col-4 text-start ',
                  )}
                >
                  <div className="col-12">
                    <FlightLanding />
                    <span className="color-grey-1">مقصد</span>
                  </div>
                  <div className="col-12 pt-2">{data?.arrivalCity}</div>
                  <div className="col-12">{data?.arrivalCityEnglish}</div>
                </div>
              </div>
              <div className={cn(styles.receipt__wrapper__ticketInfo__item, 'row')}>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketInfo__item__content,
                    'd-flex col-4 text-end color-black-1',
                  )}
                >
                  <div className="col-12 color-primary text-weight-500 text-7">
                    {data?.departureTime}
                  </div>
                  <div className="col-12 text-weight-500 ltr">{data?.departureCalender}</div>
                </div>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketInfo__item__content,
                    'd-flex col-4 text-center color-black-1',
                  )}
                >
                  <div className={'col-12 color-primary'}>
                    <Image
                      loader={customLoader}
                      src={
                        data?.airlineCode
                          ? API.IMAGE_DOMAIN + `airplane/${data?.airlineCode}.svg`
                          : defaultImage
                      }
                      alt="airline logo"
                      width="40px"
                      height="40px"
                      quality={100}
                      unoptimized
                      objectFit="contain"
                      onError={(e) => {
                        e.currentTarget.src = defaultImage.src;
                      }}
                    />
                  </div>
                  <div
                    className={cn(
                      styles.receipt__wrapper__ticketInfo__item__content__title,
                      'text-2 position-absolute',
                    )}
                  >
                    <div>
                      <span>{data?.airlineName}</span>
                    </div>
                    <Divider
                      className={styles['receipt__wrapper__divider--left']}
                      type="horizontal"
                    />
                    <Divider
                      className={styles['receipt__wrapper__divider--right']}
                      type="horizontal"
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketInfo__item__content,
                    'd-flex col-4 text-start',
                  )}
                >
                  <div className="col-12 color-primary text-weight-500 text-7">
                    <span>{data?.arrivalTime}</span>
                  </div>
                  <div className="col-12 text-weight-500 ltr">
                    <span>{data?.arrivalCalender}</span>
                  </div>
                </div>
              </div>
              <div className={cn(styles.receipt__wrapper__airport)}>
                <div className={cn(styles.receipt__wrapper__airport__container, 'row')}>
                  <div
                    className={cn(
                      styles.receipt__wrapper__airport__container__endpoint,
                      'd-flex col-6 text-end',
                    )}
                  >
                    <div className="col-12 pb-2">
                      <span className="text-2 color-grey-1">{data?.departureAirport}</span>
                    </div>
                    <div className="col-12 text-4 text-weight-500">
                      {data?.departureTerminal && <span>ترمینال {data?.departureTerminal}</span>}
                    </div>
                  </div>
                  <div
                    className={cn(
                      styles.receipt__wrapper__airport__container__endpoint,
                      'd-flex col-6 text-start',
                    )}
                  >
                    <div className="col-12 pb-2">
                      <span className="text-2 color-grey-1">{data?.arrivalAirport}</span>
                    </div>
                    <div className="col-12 text-4 text-weight-500">
                      {data?.arrivalTerminal && <span>ترمینال {data?.arrivalTerminal}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={cn(styles.receipt__wrapper__footer)}>
              <div className={styles.receipt__wrapper__footer__item}>
                <div className={styles.receipt__wrapper__footer__item__content}>
                  <AirplaneTicket />
                  <div className="pe-2">
                    <div className="pb-1 text-1">نوع بلیط</div>
                    <div className="color-black">{data?.isCharter ? 'چارتر' : 'سیستمی'}</div>
                  </div>
                </div>
                <div className={cn(styles.receipt__wrapper__footer__item__content, 'color-grey-1')}>
                  <SeatLegroomIcon />
                  <div className="pe-2">
                    <div className="pb-1 text-1">کلاس کابین</div>
                    <div className="color-black">
                      {data?.flightClass === 'ECONOMY' ? 'اکونومی' : 'بیزینس'}
                    </div>
                  </div>
                </div>
                <div className={cn(styles.receipt__wrapper__footer__item__content, 'color-grey-1')}>
                  <LuggageIcon />
                  <div className="pe-2">
                    <div className="pb-1 text-1">مقدار بار مجاز</div>
                    <div className="color-black">
                      {data?.age === 'نوزاد'
                        ? data?.allowedBaggage?.[0]?.infantWeight
                        : data?.allowedBaggage?.[0]?.adultAndChildWeight}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cn(styles.receipt__ticketDetail, 'col-2 text-weight-500')}>
            <div className={styles['receipt__ticketDetail--rows']}>
              {rowDetail({ label: 'تاریخ صدور', data: data?.issueDateCalender })}
              {rowDetail({ label: 'شماره بلیط', data: data?.ticketNumber })}
              {rowDetail({ label: 'کد مرجع(PNR)', data: data?.pnr })}
            </div>
            <Divider className={styles['receipt__ticketDetail--divider']} type="horizontal" />
            <div className={styles['receipt__ticketDetail--rows']}>
              {rowDetail({ label: 'نرخ پایه', data: data?.price, price: true })}
              {rowDetail({ label: 'مالیات', data: data?.tax, price: true })}
              {rowDetail({
                label: 'استرداد بدون جریمه',
                data: data?.zeroRefund || 0,
                price: true,
              })}
              {rowDetail({ label: 'تخفیف', data: data?.discount, price: true })}
              <div className="color-primary">
                <span className="text-2">بهای کل:</span>
                <div>
                  <span className="text-4">
                    {parseInt(data?.totalPrice as string)?.toLocaleString()}
                  </span>
                  <span className="text-2"> ریال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReceiptDesktop;
