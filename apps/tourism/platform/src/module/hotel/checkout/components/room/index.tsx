import { HotelBed } from 'assets/icons';
import style from './style.module.scss';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';
import { THotelOrderPassengers, THotelOrderRoom } from 'services/hotel/orders/interface';
import useDeviceDetect from '../../../../../utils/hooks/useDeviceDetect';
import cn from 'classnames';

interface Props {
  index: number;
  room: THotelOrderRoom;
  passengers: THotelOrderPassengers;
}
export const Room = ({ index, room, passengers }: Props) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className={style['room']}>
      <div className={style['room__header']}>
        {isMobile ? (
          <>
            <div className="col-1">
              <HotelBed />
            </div>
            <div className="col-11">اتاق {PersianIndexNumber[index]}</div>
          </>
        ) : (
          <div className="d-flex col-12">
            <div className="col-6 d-flex">
              <div className="ms-2">
                <HotelBed />
              </div>
              <div className="col-11">اتاق {PersianIndexNumber[index]}</div>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <span className="mx-1">ظرفیت</span>
              <span>
                {room.roomInfo?.capacity} نفر {room?.roomInfo?.hasExtraBed ? ' + ۱ نفر اضافه' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className={style['room__content']}>
        <div className="d-flex align-items-center text-3 ">
          <div className={cn(!isMobile && 'text-4', 'col-8')}>{room.roomInfo?.name}</div>
          <div
            className={cn(
              !isMobile && 'text-5 align-items-center',
              'col-4 color-primary d-flex justify-content-end',
            )}
          >
            {room.priceDetail?.price?.totalPrice?.toLocaleString()}
            <div className="text-2 text-weight-400 me-2">ریال</div>
          </div>
        </div>
        {passengers.find((x) => x.roomID == room.roomId)?.extraBed ? (
          <div className="d-flex align-items-center text-3 ">
            <div className={cn(!isMobile && 'text-3', ' text-2 col-8')}>سرویس اضافه</div>
            <div
              className={cn(
                !isMobile && 'text-4 align-items-center',
                'col-4 color-primary d-flex justify-content-end text-2',
              )}
            >
              {room.priceDetail?.extraBed?.price?.toLocaleString()}
              <div className="text-2 text-weight-400 me-2">ریال</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {passengers.find((x) => x.roomID == room.roomId)?.earlyCheckin ? (
          <div className="d-flex align-items-center text-3 ">
            <div className={cn(!isMobile && 'text-3', ' text-2 col-8')}>ورود زود هنگام </div>
            <div
              className={cn(
                !isMobile && 'text-4 align-items-center',
                'col-4 color-primary d-flex justify-content-end text-2',
              )}
            >
              {room.priceDetail?.halfCharge?.early?.price?.toLocaleString()}
              <div className="text-2 text-weight-400 me-2">ریال</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {passengers.find((x) => x.roomID == room.roomId)?.lateCheckout ? (
          <div className="d-flex align-items-center text-3 ">
            <div className={cn(!isMobile && 'text-3', 'text-2 col-8')}>خروج دیرهنگام </div>
            <div
              className={cn(
                !isMobile && 'text-4 align-items-center',
                'col-4 color-primary d-flex justify-content-end text-2',
              )}
            >
              {room.priceDetail?.halfCharge?.late?.price?.toLocaleString()}
              <div className="text-2 text-weight-400 me-2">ریال</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {isMobile && (
          <div className="d-flex align-items-center text-2 text-weight-500 pt-2">
            <div className="col-6 color-grey-19">ظرفیت اتاق</div>
            <div className="col-6 d-flex justify-content-end">
              {room.roomInfo?.capacity}
              <div className=" text-weight-400 me-1">نفر</div>
              {room?.roomInfo?.hasExtraBed ? ' + ۱ نفر اضافه' : ''}
            </div>
          </div>
        )}
        <div className="d-flex my-3 gap-2">
          {!room?.roomInfo?.refundable ? (
            <div className={style['room__content__refundable']}>غیر قابل استرداد </div>
          ) : (
            <></>
          )}
          {room.roomInfo?.tagList?.length
            ? room.roomInfo?.tagList?.map((tag, index) => {
                return (
                  <div key={`tag-${index}`} className={style['room__content--tags']}>
                    {tag}
                  </div>
                );
              })
            : null}
        </div>
        <div className={style['room__divider']} />
        <div className="my-3">
          <div className="d-flex align-items-center text-3  ">
            <div className="col-6 text-weight-500">سرپرست مسافران</div>
            <div className="col-6 d-flex justify-content-end">
              {passengers.find((x) => x.roomID == room.roomId)?.name ||
                passengers.find((x) => x.roomID == room.roomId)?.nameEn}{' '}
              {passengers.find((x) => x.roomID == room.roomId)?.family ||
                passengers.find((x) => x.roomID == room.roomId)?.familyEn}
            </div>
          </div>
          <div className="d-flex align-items-center text-3  mt-2">
            <div className="col-6 color-grey-19">شماره موبایل</div>
            <div className="col-6  d-flex justify-content-end">
              {passengers.find((x) => x.roomID == room.roomId)?.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
