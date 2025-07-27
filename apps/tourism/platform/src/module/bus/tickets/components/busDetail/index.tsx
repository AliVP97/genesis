import React from 'react';
import cn from 'classnames';
import styles from '../busDetail/ticketDetail.module.scss';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import Divider from 'components/divider';
import { BusInfo } from 'services/bus/tickets/interface';
import { MiddleStations } from 'module/bus/tickets/components/middleStations';

interface Props {
  ticket: BusInfo;
  isDesktop?: boolean;
  openedDetailId?: string;
}

const BusDetail = ({ ticket }: Props) => {
  return (
    <>
      <div className={cn(styles['ticket-detail__content'], 'container')}>
        <div
          className={cn('p-3')}
          style={{
            borderRadius: '0',
            width: '100%',
          }}
        >
          <div className="d-flex">
            <div className="d-flex px-0 align-items-center d-flex justify-content-center">
              {ticket?.logo && (
                <Image
                  loader={customLoader}
                  src={ticket?.logo as string}
                  alt="bus logo"
                  width="32px"
                  height="32px"
                  quality={100}
                  unoptimized
                />
              )}
              <div className=" text-weight-500 text-2 d-flex flex-column me-3">
                <span>{ticket?.companyName}</span>
                <span>{ticket?.busName}</span>
              </div>
            </div>
          </div>
          <div className="pe-5 py-3 position-relative">
            <div className="pb-4">
              <div className="col d-flex align-items-center">
                <span className="color-primary text-5 text-weight-500 ps-1">
                  {ticket?.departureHourString}
                </span>
                <span className="color-primary text-weight-500 ps-2">{ticket?.originCity}</span>
                <span className="text-2">{ticket?.departureDateString}</span>
              </div>
              <div className="color-grey-1 text-2">{ticket?.originStation}</div>
            </div>

            {Number(ticket?.distance) != 0 && (
              <span className="color-grey-1 text-3 d-flex">{ticket?.distance}کیلومتر</span>
            )}

            <div>
              <div className="col d-flex align-items-center pt-4">
                <span className="color-primary text-weight-500 ps-2">
                  {ticket?.destinationCity}
                </span>
                {ticket?.finalDestinationCity ? (
                  <div className="color-primary text-2 bg-color-white-2">
                    مقصد نهایی:
                    <br />
                    {ticket?.finalDestinationCity}
                  </div>
                ) : (
                  <></>
                )}
              </div>{' '}
              <div className="color-grey-1 text-2">{ticket?.destinationStation}</div>
            </div>
            <div className={styles['ticket-detail__content-timeInfo']}>
              <div className={styles['ticket-detail__content-timeInfo--circle']} />
              <div className={styles['ticket-detail__content-timeInfo--trail']} />
              <div className={styles['ticket-detail__content-timeInfo--circle']} />
            </div>
          </div>
        </div>
      </div>{' '}
      <Divider className="mx-3" type={'horizontal'} />
      {ticket?.roadMap?.length != 0 ? (
        <div className="d-flex flex-column rtl p-4">
          <span className="text-3 text-weight-500">توقف در شهرهای :</span>
          {<MiddleStations stations={ticket?.roadMap || []} />}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default BusDetail;
