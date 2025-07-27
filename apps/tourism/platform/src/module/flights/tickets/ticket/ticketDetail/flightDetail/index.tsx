import React from 'react';
import cn from 'classnames';
import styles from '../ticketDetail.module.scss';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import Image from 'next/image';
import API from 'utils/routes/api';
import { ChildIcon, LuggageIcon } from 'assets/icons';
import { customLoader } from 'utils/helpers/imageLoader';
import defaultImage from 'public/images/default-domestic-flight.png';

interface Props {
  ticket: TicketType;
  isDesktop?: boolean;
}

const FlightDetail = ({ ticket, isDesktop }: Props) => {
  const arrivalTime = ticket?.arrival?.date;
  const departureTime = ticket?.departure?.date;
  const diffTime = ticket && Math.abs(arrivalTime! - departureTime!);

  const flightDurationInHours = ticket && Math.floor(diffTime / 3600);
  const flightDurationInMinutes =
    ticket && (diffTime % 3600 !== 0 ? Math.abs(diffTime - flightDurationInHours * 3600) / 60 : 0);

  let flightClass: string;
  if (ticket?.flightClass && ticket?.flightClass === 'BUSINESS') {
    flightClass = 'بیزینس';
  } else {
    flightClass = 'اکونومی';
  }

  return (
    <div className={cn(styles['ticket-detail__content'])}>
      {!isDesktop && (
        <div className="pt-2">
          <span
            className={cn(
              styles['ticket-detail__content__head'],
              'text-3 d-flex align-items-center color-primary pe-3',
            )}
          >
            {ticket?.departure?.airport?.city?.name?.farsi} به{' '}
            {ticket?.arrival?.airport?.city?.name?.farsi}
          </span>
        </div>
      )}
      <div
        className={`${
          isDesktop
            ? styles['ticket-detail__content__desktop-body']
            : styles['ticket-detail__content__mobile-body']
        } p-3`}
      >
        <div className="d-flex">
          <div className="d-flex px-0 align-items-center d-flex justify-content-center">
            <Image
              loader={customLoader}
              src={
                ticket?.airline?.code
                  ? API.IMAGE_DOMAIN + `airplane/${ticket?.airline?.code}.svg`
                  : defaultImage
              }
              alt="airline logo"
              width="32px"
              height="32px"
              quality={100}
              unoptimized
              objectFit="contain"
              onError={(e) => {
                e.currentTarget.src = defaultImage.src;
              }}
            />
          </div>
          <div className="col p-0 me-3">
            <div className="d-flex mb-2">
              <span className="text-weight-500">{ticket?.airline?.name}</span>
              <span className="me-5 color-grey-1">
                {flightClass} <span className="en">{ticket?.airplaneModel}</span>
              </span>
            </div>
            <div className="d-flex align-items-center text-2 ">
              <span className="d-flex ms-1 color-grey-1">شماره پرواز:</span>
              <span className="color-black en text-3 ms-1">{ticket?.flightNumber}</span>
              <span className="d-flex me-1 color-grey-1">کلاس نرخی:</span>
              <span className="color-black en text-3 me-1">{ticket?.fareClass}</span>
            </div>
          </div>
        </div>

        <div className="pe-5 py-3 position-relative">
          <div className="pb-3">
            <div className="col d-flex align-items-center">
              <span className="color-primary text-5 text-weight-500 ps-1">
                {ticket?.departure?.dateHourString}
              </span>
              <span className="color-primary text-weight-500 ps-2">
                {ticket?.departure?.airport?.city?.name?.farsi}
              </span>
              <span className="text-2">{ticket?.departure?.dateString}</span>
            </div>

            <div>
              <div className="text-3 color-grey-1 d-flex align-items-center">
                {ticket?.departure?.airport?.name?.farsi} ({ticket?.departure?.airport?.iata}){' '}
                {ticket?.departure?.terminal && (
                  <>
                    <span className="me-2 color-grey-1 text-3">ترمینال:</span>
                    <span className="color-black en text-3 px-1">
                      {ticket?.departure?.terminal}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <span className="color-grey-1 text-3 d-flex">
            {flightDurationInHours != 0 && (
              <>
                <span className="ps-1">{flightDurationInHours}</span>
                <span>ساعت</span>
              </>
            )}
            {flightDurationInHours != 0 && flightDurationInMinutes != 0 && (
              <span className="px-1">و</span>
            )}
            {flightDurationInMinutes != 0 && (
              <>
                <span className="ps-1">{flightDurationInMinutes}</span>
                <span>دقیقه</span>
              </>
            )}
          </span>
          <div>
            <div className="col d-flex align-items-center pt-3">
              <span className="color-primary text-5 text-weight-500 ps-1">
                {ticket?.arrival?.dateHourString}
              </span>
              <span className="color-primary text-weight-500 ps-2">
                {ticket?.arrival?.airport?.city?.name?.farsi}
              </span>
              <span className="text-2">{ticket?.arrival?.dateString}</span>
            </div>
            <div>
              <div className="text-3 color-grey-1 d-flex align-items-center">
                {ticket?.arrival?.airport?.name?.farsi} ({ticket?.arrival?.airport?.iata}){' '}
                {ticket?.arrival?.terminal && (
                  <>
                    <span className="me-2 color-grey-1 text-3">ترمینال:</span>
                    <span className="color-black en text-3 px-1">{ticket?.arrival?.terminal}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles['ticket-detail__content-timeInfo']}>
            <div className={styles['ticket-detail__content-timeInfo--circle']} />
            <div className={styles['ticket-detail__content-timeInfo--trail']} />
            <div className={styles['ticket-detail__content-timeInfo--circle']} />
          </div>
        </div>
        {isDesktop && ticket?.allowedBaggage && (
          <div className="color-red pt-2 pe-5 text-weight-500">
            <div>
              <LuggageIcon className={styles.luggageIcon} />
              <span className=" text-2">
                بار مجاز پرواز:
                {ticket?.allowedBaggage[0]?.adultAndChildWeight}
                کیلوگرم به ازای هر مسافر
              </span>
            </div>
            <div>
              <ChildIcon className="mx-1" />
              <span className=" text-2">
                بار مجاز نوزاد:
                {ticket?.allowedBaggage[0]?.infantWeight}
                کیلوگرم به ازای هر نوزاد
              </span>
            </div>
          </div>
        )}
      </div>{' '}
      {!isDesktop && ticket?.allowedBaggage && (
        <div className="color-red pt-2 pe-5 text-weight-500">
          <div>
            <LuggageIcon className={styles.luggageIcon} />
            <span className=" text-2">
              بار مجاز پرواز:
              {ticket?.allowedBaggage[0]?.adultAndChildWeight}
              کیلوگرم به ازای هر مسافر
            </span>
          </div>
          <div>
            <ChildIcon className="mx-1" />
            <span className=" text-2">
              بار مجاز نوزاد:
              {ticket?.allowedBaggage[0]?.infantWeight}
              کیلوگرم به ازای هر مسافر
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetail;
