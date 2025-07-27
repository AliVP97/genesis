import React, { FC } from 'react';
import styles from './style.module.scss';

import { THotelInfo } from 'services/hotel/prepare/interface';
import { MapPin, Star } from 'assets/icons';
import classNames from 'classnames';
import Divider from 'components/divider';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  info: THotelInfo;
  duration?: number;
  isMobile: boolean;
  requestId: string | undefined;
  containerStyles?: React.CSSProperties;
  uuid: string;
}
const HotelItem: FC<Props> = ({ info, duration, isMobile, requestId, containerStyles, uuid }) => {
  const { query } = useRouter();
  return isMobile ? (
    <>
      <Link
        href={{
          pathname: `/hotel/${query?.id}/${uuid}`,
          query: {
            hotelId: info?.hotelId,
            rooms: query?.rooms,
            requestId: requestId,
          },
        }}
        // href={`/hotel/detail/${requestId}/${info.hotelId}`}
        passHref
      >
        <div style={{ ...containerStyles }} className={styles.hotel__pwa}>
          <div className={styles.hotel__pwa__images}>
            {info.images?.map((image, index) => (
              <div className={styles.hotel__pwa__images__item} key={index.toString() + image}>
                <Image
                  loader={customLoader}
                  src={`${image}`}
                  alt="hotel logo"
                  width="182px"
                  height="120px"
                  quality={100}
                  className="mx-1"
                />
              </div>
            ))}{' '}
          </div>
          <div className="col-12 d-flex">
            <div className=" col-8 text-4">{info.name}</div>
            <div className={classNames('col-4', styles.hotel__pwa__stars)}>
              {[...Array(Number(info.star))].map((_, index) => (
                <Star key={index.toString() + 'hotelItem'} />
              ))}
            </div>
          </div>
          <div className="col-12 d-flex align-items-center mt-2">
            <div className="col-1">
              <MapPin />
            </div>
            <div className="col-11 text-2 text-wrap">{info.address}</div>
          </div>
          <div className="col-12 d-flex align-items-center mt-2">
            {/* <div className="col-1"><DoubleBed /></div> */}
            <div className="col-11 text-2">{info.description}</div>
          </div>
          {info.facility?.length != 0 && (
            <div className="mb-2 d-flex">
              <div className="text-2 color-grey-19 pt-2">امکانات ویژه:</div>
              <div className="d-flex flex-wrap">
                {info.facility?.map((item, index) => (
                  <div
                    className={classNames('col', styles.hotel__pwa__facility)}
                    key={index.toString() + item?.name}
                  >
                    {item.name}
                  </div>
                ))}{' '}
              </div>
            </div>
          )}
          <div className={styles.hotel__pwa__footer}>
            <Divider type="horizontal" />
            <div className="col-12 d-flex mt-3">
              <div className="col-6 text-3">شروع قیمت {duration} شب</div>
              <div className={classNames('col-6', styles.hotel__pwa__footer__price)}>
                {info.priceDetail?.discountPercent && info.priceDetail?.discountPercent !== '0' ? (
                  <div
                    className={classNames(
                      'd-flex flex-column',
                      styles.hotel__pwa__footer__price__container,
                    )}
                  >
                    <div className="d-flex">
                      <span className={styles.hotel__pwa__footer__price__discount}>
                        تا %{info.priceDetail.discountPercent} تخفیف
                      </span>
                      <div className={styles.hotel__pwa__footer__price__withDiscount}>
                        {Number(info.priceDetail.totalPrice)?.toLocaleString()}
                        <span className="text-2">ریال</span>
                      </div>
                    </div>
                    <div className="align-items-center text-5">
                      {Number(info.priceDetail.priceAfterDiscount)?.toLocaleString()}
                      <span className="text-2 color-grey-1">ریال</span>
                    </div>
                  </div>
                ) : (
                  <div> {info.priceDetail?.totalPrice?.toLocaleString()}ریال</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  ) : (
    <>desktop items</>
  );
};
export default HotelItem;
