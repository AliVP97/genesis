import { TGetHotelOrder } from 'services/hotel/orders/interface';
import React, { FC } from 'react';
import style from './style.module.scss';
import Image from 'next/image';
import { tempHotel } from 'assets/images';
import { Star } from 'assets/icons';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import dayjs from 'dayjs';

interface Props {
  order: TGetHotelOrder;
  passengersLength?: number;
}

const HeaderInfo: FC<Props> = ({ order, passengersLength }) => {
  const totalSeconds =
    Math.abs(Number(dayjs(order.checkDate?.checkOut)) - Number(dayjs(order.checkDate?.checkIn))) /
    1000;

  const duration = Math.floor(totalSeconds / (60 * 60 * 24));
  return (
    <div className={style['header']}>
      <div className="d-flex py-3">
        <div className="col-1 me-2">
          <Image
            className="rounded-3"
            src={order.hotelInfo?.images?.length ? `${order?.hotelInfo?.images?.[0]}` : tempHotel}
            alt="hotel"
            width="110"
            height="70"
            unoptimized
          />
        </div>
        <div className="col-7 d-flex flex-column me-3">
          <div className="d-flex align-items-center">
            <span className="text-4 text-weight-500 ms-2">{order.hotelInfo?.name}</span>
            {[...Array(order?.hotelInfo?.star)].map((_, index) => (
              <Star key={index.toString() + 'hotelHeaderInfo'} />
            ))}
          </div>
          <div className="mt-3 text-2">آدرس : {order.hotelInfo?.address}</div>
        </div>
      </div>
      <div className={style['header__footer']}>
        <div className="col-6 text-weight-500 text-3 me-3">
          {passengersLength ? `${passengersLength}  مسافر` : null}
        </div>
        <div className="col-6 text-start d-flex">
          <span className="col-9">
            <span>
              {DATE_UTILS.formatDate(order?.checkDate?.checkIn as unknown as number, {
                lang: 'fa',
                showDay: false,
                showMonth: false,
                showYear: false,
              })}
            </span>
            <span dir="ltr">
              {dayjs(order?.checkDate?.checkIn)
                .calendar('jalali')
                .format('YYYY-MM-DD')
                .replaceAll('-', '/')}
            </span>
            <span> تا </span>
            <span>
              {DATE_UTILS.formatDate(order?.checkDate?.checkOut as unknown as number, {
                lang: 'fa',
                showDay: false,
                showMonth: false,
                showYear: false,
              })}
            </span>
            <span dir="ltr">
              {dayjs(order?.checkDate?.checkOut)
                .calendar('jalali')
                .format('YYYY-MM-DD')
                .replaceAll('-', '/')}
            </span>
          </span>
          <span className="col-2 text-weight-500">
            {duration} شب و {duration + 1} روز
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderInfo;
