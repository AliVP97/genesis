import React, { useMemo } from 'react';
import cn from 'classnames';
import styles from '../trainDetail/ticketDetail.module.scss';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import Divider from 'components/divider';
import { useGetTicketOptions } from '../../hooks/useGetTicketOptions';
import { TicketType, wagonType } from 'module/train/tickets/interface';
import { InfoIcon } from 'assets/icons';
import { useRouter } from 'next/router';
import { TrainOptionPayload } from 'services/train/servicesAndCatering/interface';

interface Props {
  ticket: TicketType;
  isDesktop?: boolean;
  optionals?: TrainOptionPayload['optionalServices'];
  isLoadingOptionals?: boolean;
  openedDetailId?: string;
}

const TrainDetail = ({ ticket, isDesktop, isLoadingOptionals, openedDetailId }: Props) => {
  const {
    optionalServices,
    freeOptionalServices,
    isLoading: isLoadingOptionalServices,
  } = useGetTicketOptions(ticket?.trainId, !isDesktop || ticket?.trainId === openedDetailId);

  const { query } = useRouter();
  const passenger = useMemo(
    () => Number(query?.adult) + Number(query?.child) + Number(query?.infant),
    [query],
  );

  const isPassengerAvailableSeat = Number(ticket?.availableSeatCount) < passenger;

  const arrivalTime = ticket?.arrivalDate;
  const departureTime = ticket?.departureDate;
  const diffTime = ticket && Math.abs(Number(arrivalTime) - Number(departureTime));

  const trainDurationInHours = ticket && Math.floor(diffTime / 3600);
  const trainDurationInMinutes =
    ticket && (diffTime % 3600 !== 0 ? Math.abs(diffTime - trainDurationInHours * 3600) / 60 : 0);
  return (
    <>
      {isPassengerAvailableSeat && (
        <div className="bg-color-orange-alert d-flex justify-content-center align-items-center py-3 rtl">
          <InfoIcon className={styles['warning-icon']} />
          <span className="text-2 color-brown pe-1">
            ظرفیت باقی‌مانده این قطار، کمتر از تعداد مسافر انتخابی شما است.
          </span>
        </div>
      )}
      <div className={cn(styles['ticket-detail__content'], !isDesktop ? 'container' : 'pb-2')}>
        <div
          className={cn(isDesktop && 'bg-color-white-1', 'p-3')}
          style={{
            borderRadius: isDesktop ? '8px' : '0',
            width: isDesktop ? '97%' : '100%',
          }}
        >
          <div className="d-flex">
            <div className="d-flex px-0 align-items-start d-flex">
              <Image
                loader={customLoader}
                src={`${ticket?.logoUrl}`}
                alt="train logo"
                width="50px"
                height="50px"
                quality={100}
                unoptimized
              />
            </div>
            <div className="col p-0 me-3">
              <div className="d-flex d-flex flex-column text-2">
                <div className="mb-2 d-flex">
                  <span className="color-black ms-1 text-3 text-weight-500">
                    {ticket?.companyName}
                  </span>
                  {ticket?.wagonType && <span>{wagonType(ticket?.wagonType)}</span>}
                  {isDesktop && (
                    <span className="d-flex me-3 color-grey-1 text-3">
                      شماره قطار:
                      <span className="color-black en text-3 pe-2">{ticket?.trainNumber}</span>
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="color-black text-2 text-weight-500">{ticket?.wagonName}</span>
                </div>
                {!isDesktop && (
                  <div className="mb-2">
                    <span className="d-flex ms-1 color-grey-1 text-3">
                      شماره قطار:
                      <span className="color-black en text-3 pe-2">{ticket?.trainNumber}</span>
                    </span>
                  </div>
                )}{' '}
              </div>
            </div>
          </div>
          <div className="pe-5 py-3 position-relative">
            <div className="pb-4">
              <div className="col d-flex align-items-center">
                <span className="color-primary text-5 text-weight-500 ps-1">
                  {ticket?.departureDateHourString}
                </span>
                <span className="color-primary text-weight-500 ps-2">{ticket?.originName}</span>
                <span className="text-2">{ticket?.departureDateString}</span>
              </div>
            </div>
            <span className="color-grey-1 text-3 d-flex">
              <span className="ps-1">{trainDurationInHours}</span>
              <span>ساعت</span>
              {trainDurationInMinutes != 0 && (
                <>
                  <span className="px-1">و</span>
                  <span className="ps-1">{trainDurationInMinutes}</span>
                  <span>دقیقه</span>
                </>
              )}
            </span>
            <div>
              <div className="col d-flex align-items-center pt-4">
                <span className="color-primary text-5 text-weight-500 ps-1">
                  {ticket?.arrivalDateHourString}
                </span>
                <span className="color-primary text-weight-500 ps-2">
                  {ticket?.destinationName}
                </span>
                <span className="text-2">{ticket?.arrivalDateString}</span>
              </div>
            </div>
            <div className={styles['ticket-detail__content-timeInfo']}>
              <div className={styles['ticket-detail__content-timeInfo--circle']} />
              <div className={styles['ticket-detail__content-timeInfo--trail']} />
              <div className={styles['ticket-detail__content-timeInfo--circle']} />
            </div>
          </div>{' '}
        </div>{' '}
        {!isDesktop && <Divider type={'horizontal'} />}
      </div>
      {ticket?.trainOptions?.length && (
        <div
          className={cn(isDesktop && 'bg-color-white-1', 'p-3 rtl')}
          style={{
            borderRadius: isDesktop ? '8px' : '0',
            width: isDesktop ? '97%' : '100%',
          }}
        >
          <div className={cn('text-3 text-weight-bold mb-3', isDesktop && 'color-grey-1')}>
            امکانات عمومی قطار{' '}
          </div>
          <div className={cn('d-flex flex-row flex-wrap ', !isDesktop && 'justify-content-evenly')}>
            {ticket.trainOptions.map((item) => {
              return (
                <>
                  <div
                    className={cn(
                      styles['ticket-detail__options'],
                      'd-flex flex-column align-items-center ms-2',
                    )}
                    key={item.code}
                  >
                    {item?.iconUrl ? (
                      <Image
                        loader={customLoader}
                        src={`${item?.iconUrl}`}
                        alt="train logo"
                        width="50px"
                        height="50px"
                        quality={100}
                        unoptimized
                      />
                    ) : (
                      <Image
                        loader={customLoader}
                        src="https://cdn.780.team/dl/airplane/I3.svg"
                        alt="train logo"
                        width="50px"
                        height="50px"
                        quality={100}
                        unoptimized
                      />
                    )}
                    <div className="text-2 color-grey-1">{item.text}</div>
                  </div>
                </>
              );
            })}
          </div>
          {!isDesktop && <Divider type={'horizontal'} />}{' '}
        </div>
      )}
      {isLoadingOptionalServices || isLoadingOptionals ? (
        <div className="d-flex justify-content-center">
          {' '}
          <div
            className={styles['loader']}
            style={{
              top: '73%',
              fontSize: '5px',
            }}
          ></div>
        </div>
      ) : (
        <>
          {optionalServices && optionalServices?.length > 0 && (
            <div
              className={cn(isDesktop && 'bg-color-white-1 mt-2', 'p-3 rtl')}
              style={{
                borderRadius: isDesktop ? '8px' : '0',
                width: isDesktop ? '97%' : '100%',
              }}
            >
              <div className={cn('text-3 text-weight-bold mb-3', isDesktop && 'color-grey-1')}>
                خدمات و پذیرایی
              </div>
              <div className={cn(!isDesktop ? ' flex-column text-3' : 'flex-wrap', 'd-flex')}>
                {optionalServices?.map((item) => {
                  return (
                    <div
                      className={cn(
                        'd-flex flex-row  mb-2',
                        !isDesktop ? 'justify-content-between ' : 'text-2',
                      )}
                      key={item.id}
                    >
                      <div className={cn(!isDesktop ? 'color-grey-1' : 'mx-2')}>{item.name}</div>
                      <div className="color-black ms-1">
                        {item.price ? `${Number(item.price).toLocaleString()} ریال ` : 'رایگان'}
                      </div>
                      {isDesktop && '/'}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {freeOptionalServices && freeOptionalServices?.length > 0 && (
            <div
              className={cn(isDesktop && 'bg-color-white-1 mt-2', 'p-3 rtl')}
              style={{
                borderRadius: isDesktop ? '8px' : '0',
                width: isDesktop ? '97%' : '100%',
              }}
            >
              <div className={cn('text-3 text-weight-bold mb-3', isDesktop && 'color-grey-1')}>
                خدمات رایگان
              </div>
              <div className={cn(!isDesktop ? ' flex-column text-3' : 'flex-wrap', 'd-flex')}>
                {freeOptionalServices?.map((item) => {
                  return (
                    <div
                      className={cn(
                        'd-flex flex-row  mb-2',
                        !isDesktop ? 'justify-content-between ' : 'text-2',
                      )}
                      key={item.id}
                    >
                      <div className={cn(!isDesktop ? 'color-grey-1' : 'mx-2')}>{item.name}</div>
                      <div className="color-black ms-1">
                        {item.price == '0'
                          ? 'رایگان'
                          : `${Number(item.price).toLocaleString()} ریال `}
                      </div>
                      {isDesktop && '/'}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TrainDetail;
