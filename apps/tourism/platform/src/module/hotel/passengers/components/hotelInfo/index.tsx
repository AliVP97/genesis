import { TGetHotelOrder } from 'services/hotel/orders/interface';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import style from './style.module.scss';
import { Star, UserIcon, Calender } from 'assets/icons';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';
import { RoomsPassengers } from '../..';

type TProps = {
  data: TGetHotelOrder | undefined;
  rooms: RoomsPassengers;
};

const HotelInfo = ({ data, rooms }: TProps) => {
  return (
    <div className={style['main']}>
      <div className={style['hotel']}>
        {data?.hotelInfo?.images?.[0] && (
          <Image
            loader={customLoader}
            width={'115px'}
            height={'86px'}
            className={style['hotel-image']}
            quality={100}
            src={data?.hotelInfo?.images?.[0]}
            alt="تصویر هتل"
          />
        )}
        <div className={style['info']}>
          <div className={style['hotel-title']}>{data?.hotelInfo?.name}</div>
          <div className={style['starts']}>
            {data?.hotelInfo?.star &&
              Array.from({ length: data?.hotelInfo?.star }).map((x) => (
                <Star key={x?.toString() + 'hotelInfo'} />
              ))}
          </div>
          <div className={style['address']}>آدرس: {data?.hotelInfo?.address}</div>
        </div>
      </div>
      <div className={style['divider']}></div>
      <div className={style['passengers']}>
        <div className={style['icon']}>
          <UserIcon />
        </div>
        <div className={style['info']}>{data?.passengers?.length} مسافر</div>
      </div>
      <div className={style['date']}>
        <div className={style['icon']}>
          <Calender />
        </div>
        <div className={style['info']}>
          {data?.checkDate?.checkInString} تا {data?.checkDate?.checkOutString}
        </div>
      </div>
      {rooms.map((room, index) => {
        return (
          <>
            <div className={style['divider']}></div>
            <div className={style['room']}>
              <div className={style['info']}>
                <div className={style['right']}>
                  <div className={style['title']}>اتاق {PersianIndexNumber[index]}</div>
                  <div className={style['sub-title']}>{room.name}</div>
                </div>
                <div className={style['left']}>
                  <div className={style['capacity']}>ظرفیت {room?.capacity} نفر</div>
                  <div className={style['price']}>
                    <span>{room?.roomePrice?.toLocaleString()}</span>
                    <span className={style['unit']}>ریال</span>
                  </div>
                </div>
              </div>
              <div className={style['options']}>
                <div className={style[!!room.hasBreakfast + '']}>
                  {room.hasBreakfast ? 'همراه ' : 'بدون '}
                  صبحانه
                </div>

                {room?.extraBed?.isAvailable && <div>تخت اضافه</div>}
                {!room?.refundable ? (
                  <span className={style['options__refundable']}>غیر قابل استرداد </span>
                ) : (
                  <></>
                )}
              </div>
              {room.earlyCheckin?.isChecked ? (
                <div className="d-flex mt-3">
                  <div className="col-6 d-flex align-items-center color-primary text-4 text-weight-500">
                    <span className="text-1 me-1">ریال</span>
                    <span>{room.earlyCheckin?.price?.toLocaleString()}</span>
                  </div>
                  <div className="col-6 rtl text-3 text-weight-500">ورود زود هنگام</div>
                </div>
              ) : (
                <></>
              )}

              {room.lateCheckout?.isChecked ? (
                <div className="d-flex mt-3">
                  <div className="col-6 d-flex align-items-center color-primary text-4 text-weight-500">
                    <span className="text-1 me-1">ریال</span>
                    {room.lateCheckout?.price?.toLocaleString()}
                  </div>
                  <div className="col-6 rtl text-3 text-weight-500">خروج دیرهنگام</div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        );
      })}
    </div>
  );
};

export { HotelInfo };
