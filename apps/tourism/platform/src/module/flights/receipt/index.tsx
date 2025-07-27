import React, { useState } from 'react';
import styles from './viewReceipt.module.scss';
import cn from 'classnames';
import { ArrowDownIcon, ArrowUpIcon, FlightLanding, FlightTakeOff } from 'assets/icons';
import { OrderPassenger, OrderTicket } from 'services/domestic/orders/interface';
import { orderTicketData } from './helper';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import API from 'utils/routes/api';
import { NumberSeparator } from 'utils/helpers/numbers';
import style from '../search/style.module.scss';
import defaultImage from 'public/images/default-domestic-flight.png';

const ViewReceipt = ({
  detail,
  passenger,
  returnFlag,
  tripType,
}: {
  detail: OrderTicket;
  passenger: OrderPassenger;
  returnFlag: boolean;
  tripType: boolean;
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const data = orderTicketData(detail, passenger);

  const handleExpand = () => setExpand(!expand);

  let tripLabel;

  if (returnFlag) {
    tripLabel = tripType ? 'رفت' : 'برگشت';
  } else {
    tripLabel = 'یک‌طرفه';
  }

  return (
    <>
      <div
        className={cn(
          styles.order,
          'container rtl p-0 w-100 mt-0 mx-auto mb-4 justify-content-center',
        )}
        onClick={handleExpand}
      >
        <div className={cn(styles.receipt__header, 'row m-0 bg-color-primary color-white')}>
          <div className="col-6 text-end">
            <span>{tripLabel}</span>
          </div>
          <div className="col-6 d-flex justify-content-end align-items-center">
            <div className="text-2 px-1">
              <span>جزییات پرواز</span>
            </div>
            {expand ? (
              <ArrowUpIcon className="fill-blue-grey" />
            ) : (
              <ArrowDownIcon className="fill-blue-grey" />
            )}
          </div>
        </div>
        <div className={cn(styles.receipt__wrapper, 'position-relative')}>
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
                <div className="col-12">
                  <span>{data?.departureCity}</span>
                </div>
                <div className="col-12">
                  <span>{data?.departureCityEnglish}</span>
                </div>
              </div>
              <div
                className={cn(
                  styles.receipt__wrapper__ticketInfo__item__content,
                  'd-flex col-4 text-center',
                )}
              >
                <div className={'col-12 color-primary'}>
                  <span>شماره پرواز</span>
                </div>
                <div className={'col-12 color-primary text-weight-500'}>
                  <span>{data?.flightNumber}</span>
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
                <div className="col-12">
                  <span>{data?.arrivalCity}</span>
                </div>
                <div className="col-12">
                  <span>{data?.arrivalCityEnglish}</span>
                </div>
              </div>
            </div>
            <div className={cn(styles.receipt__wrapper__ticketInfo__item, 'row')}>
              <div
                className={cn(
                  styles.receipt__wrapper__ticketInfo__item__content,
                  'd-flex col-4 text-end color-black-1',
                )}
              >
                <div className="col-12 color-primary text-weight-500 text-6">
                  <span>{data?.departureTime}</span>
                </div>
                <div className="col-12 text-2 text-weight-500 ltr text-nowrap">
                  <span>{data?.departureCalender}</span>
                </div>
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
                  <span>{data?.airlineName}</span>
                  {/*<span className={'color-grey-1'}>{data?.airlineCode}</span>*/}
                </div>
              </div>
              <div
                className={cn(
                  styles.receipt__wrapper__ticketInfo__item__content,
                  'd-flex col-4 text-start',
                )}
              >
                <div className="col-12 color-primary text-weight-500 text-6">
                  <span>{data?.arrivalTime}</span>
                </div>
                <div className="col-12 text-2 text-weight-500 ltr text-nowrap">
                  <span>{data?.arrivalCalender}</span>
                </div>
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
                <div className="col-12  text-weight-500">
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
                <div className="col-12 text-weight-500">
                  {data?.arrivalTerminal && <span>ترمینال {data?.arrivalTerminal}</span>}{' '}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              styles.receipt__wrapper__collapse,
              expand ? styles.receipt__wrapper__collapse__expand : '',
            )}
          >
            <div className={cn(styles.receipt__wrapper__ticketDetail)}>
              <div className={cn(styles.receipt__wrapper__ticketDetail__item, 'row')}>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketDetail__item__content,
                    'd-flex col-6 text-end',
                  )}
                >
                  <div className="col-12 pb-2">
                    <span>نام مسافر (لاتین):</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>نوع مسافر:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>کد ملی:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>تاریخ صدور:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>شماره بلیط:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>نوع بلیط:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>کلاس کابین:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>مقدار بار مجاز:</span>
                  </div>
                </div>
                <div
                  className={cn(
                    styles.receipt__wrapper__ticketDetail__item__content,
                    'd-flex col-6 text-start',
                  )}
                >
                  <div className="col-12 pb-2">
                    <span>
                      {data?.passengerEnglishFName} {data?.passengerEnglishLName}
                    </span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>{data?.age}</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>{data?.nationalCode}</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>{data?.issueDateCalender}</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>{data?.ticketNumber}</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>{data?.isCharter ? 'چارتر' : 'سیستمی'}</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>{data?.flightClass}</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span className="color-black">
                      {data?.age === 'نوزاد'
                        ? data?.allowedBaggage?.[0]?.infantWeight
                        : data?.allowedBaggage?.[0]?.adultAndChildWeight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={cn(styles.receipt__wrapper__price)}>
              <div className={cn(styles.receipt__wrapper__price__item, 'row')}>
                <div
                  className={cn(
                    styles.receipt__wrapper__price__item__content,
                    'd-flex col-6 text-end',
                  )}
                >
                  <div className="col-12 pb-2">
                    <span>نرخ پایه:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>مالیات:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>تخفیف:</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span>استرداد بدون جریمه:</span>
                  </div>
                  <div className="col-12 color-primary text-weight-500">
                    <span>بهای کل:</span>
                  </div>
                </div>
                <div
                  className={cn(
                    styles.receipt__wrapper__price__item__content,
                    'd-flex col-6 text-start color-grey-1',
                  )}
                >
                  <div className="col-12 pb-2">
                    <span className="color-black px-2">{NumberSeparator(data?.price)}</span>
                    <span className="color-black">ریال</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span className="color-black text-weight-500 px-2">
                      {NumberSeparator(data?.tax)}
                    </span>
                    <span className="color-black">ریال</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span className="color-black text-weight-500 px-2">
                      {NumberSeparator(data?.discount)}
                    </span>
                    <span className="color-black">ریال</span>
                  </div>
                  <div className="col-12 pb-2">
                    <span className="color-black text-weight-500 px-2">
                      {NumberSeparator(data?.zeroRefund)}
                    </span>
                    <span className="color-black">ریال</span>
                  </div>
                  <div className="col-12">
                    <span className="color-primary text-weight-500 px-2">
                      {NumberSeparator(data?.totalPrice)}
                    </span>
                    <span className="color-black">ریال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(styles.receipt__wrapper__footer)}>
            <div className={cn(styles.receipt__wrapper__footer__item, 'row')}>
              <div
                className={cn(
                  styles.receipt__wrapper__footer__item__content,
                  'd-flex col-6 text-end',
                )}
              >
                <div className="col-12 pb-2">
                  <span>شماره سفارش:</span>
                </div>
                <div className="col-12">
                  <span>کد مرجع (PNR):</span>
                </div>
              </div>
              <div
                className={cn(
                  styles.receipt__wrapper__footer__item__content,
                  'd-flex col-6 text-start color-grey-1',
                )}
              >
                <div className="col-12 pb-2">
                  <span>{data?.orderNumber}</span>
                </div>
                <div className="col-12">
                  <span>{data?.pnr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(returnFlag && !tripType) ||
        (!returnFlag && tripType && <div className={style['extra-space']} />)}
    </>
  );
};
export default ViewReceipt;
