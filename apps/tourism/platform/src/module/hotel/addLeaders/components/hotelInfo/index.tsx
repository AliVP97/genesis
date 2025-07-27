import { TGetHotelOrder } from 'services/hotel/orders/interface';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import style from './style.module.scss';
import { Star, UserIcon, Calender } from 'assets/icons';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';
import { TRooms } from '../../interface';

type TProps = {
  data: TGetHotelOrder | undefined;
  rooms: TRooms;
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
      {data?.room?.map((room, index) => {
        const extraBedField = rooms[index]?.leader.fields.find((item) => item.name === 'extraBed');

        return (
          <>
            <div className={style['divider']}></div>
            <div className={style['room']}>
              <div className={style['info']}>
                <div className={style['right']}>
                  <div className={style['title']}>اتاق {PersianIndexNumber[index]}</div>
                  <div className={style['sub-title']}>{room.roomInfo?.name}</div>
                </div>
                <div className={style['left']}>
                  <div className={style['capacity']}>
                    ظرفیت {room.roomInfo?.capacity} نفر
                    {room.roomInfo?.hasExtraBed ? ' + ۱ نفر اضافه' : ''}
                  </div>
                  <div className={style['price']}>
                    <span>{room.priceDetail?.price?.totalPrice?.toLocaleString()}</span>
                    <span className={style['unit']}>ریال</span>
                  </div>
                </div>
              </div>
              <div className={style['options']}>
                {!room?.roomInfo?.refundable ? (
                  <span className={style['options__refundable']}>غیر قابل استرداد </span>
                ) : (
                  <></>
                )}
                {room.roomInfo?.tagList?.length
                  ? room.roomInfo.tagList.map((tag, index) => {
                      return (
                        <div key={`tag-${index}`} className={style[!!room.roomInfo?.tagList + '']}>
                          {tag}
                        </div>
                      );
                    })
                  : null}
              </div>
              {(rooms[index] && extraBedField?.defaultValue === 'true') ||
              extraBedField?.disabled ? (
                <div className="d-flex mt-3">
                  <div className="col-6 d-flex align-items-center color-primary text-4 text-weight-500">
                    <span className="text-1 me-1">ریال</span>
                    <span>{room.priceDetail?.extraBed?.price?.toLocaleString()}</span>
                  </div>
                  <div className="col-6 rtl text-3 text-weight-500">سرویس اضافه</div>
                </div>
              ) : (
                <></>
              )}

              {rooms[index] &&
              rooms[index].leader.fields.find((item) => {
                return item.name === 'earlyEntry';
              })?.defaultValue === 'true' ? (
                <div className="d-flex mt-3">
                  <div className="col-6 d-flex align-items-center color-primary text-4 text-weight-500">
                    <span className="text-1 me-1">ریال</span>
                    <span>{room.priceDetail?.halfCharge?.early?.price?.toLocaleString()}</span>
                  </div>
                  <div className="col-6 rtl text-3 text-weight-500">ورود زود هنگام</div>
                </div>
              ) : (
                <></>
              )}

              {rooms[index] &&
              rooms[index].leader.fields.find((item) => {
                return item.name === 'lateExit';
              })?.defaultValue === 'true' ? (
                <div className="d-flex mt-3">
                  <div className="col-6 d-flex align-items-center color-primary text-4 text-weight-500">
                    <span className="text-1 me-1">ریال</span>
                    {room.priceDetail?.halfCharge?.late?.price?.toLocaleString()}
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
