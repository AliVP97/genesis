import { TTripsHotelPriceDetail, TTripsRoomStatus } from 'services/trips/types';
import styles from '../../../../../travels.module.scss';
import cn from 'classnames';

interface THotelPassengersInfoProps {
  capacity?: string;
  firstName: string;
  lastName: string;
  price?: number;
  refundPrice?: TTripsHotelPriceDetail;
  refundStatus: TTripsRoomStatus;
  title: string;
}

const HotelPassengersInfoInDesktop = ({
  capacity,
  firstName,
  lastName,
  price,
  refundPrice,
  refundStatus,
  title,
}: THotelPassengersInfoProps) => {
  let refundMessage = '-';
  let refundClass = '';

  if (refundStatus === 'ROOM_STATUS_REFUND_ACCEPTED') {
    refundMessage = 'استرداد شده';
    refundClass = 'color-green-1';
  } else if (refundStatus === 'ROOM_STATUS_REFUND_REJECTED') {
    refundMessage = 'رد شده';
    refundClass = 'color-red';
  } else if (refundStatus === 'ROOM_STATUS_REFUND_REQUESTED') {
    refundMessage = 'در حال بررسی';
    refundClass = 'color-black';
  }
  return (
    <>
      <h6>{title}</h6>
      <table className="text-center w-100">
        <thead>
          <tr
            className={cn(
              styles['travels-container__content__items__font'],
              'bg-color-surface-container color-on-surface',
            )}
          >
            <th
              className={cn(
                styles['travels-container__content__items__radius-right'],
                'text-center py-3',
              )}
            >
              نام سرپرست
            </th>
            <th className="py-3"> ظرفیت اتاق </th>
            <th> وضعیت استرداد</th>
            <th> مبلغ رزرو </th>
            <th> مبلغ جریمه </th>
            <th> مبلغ استرداد </th>
          </tr>
        </thead>
        <tbody className="bg-color-surface-container-low rounded-bottom">
          <tr>
            <td className="py-3">
              {firstName}
              {lastName}
            </td>
            <td>{capacity || '-'} نفر</td>
            <td>
              <span className={refundClass}>{refundMessage}</span>
            </td>
            <td>
              <b className="color-primary">
                {Number(price).toLocaleString() || '-'} <small>ریال</small>
              </b>
            </td>
            <td>
              {refundStatus === 'ROOM_STATUS_REFUND_ACCEPTED' ? (
                <b className="color-primary">
                  {Number(refundPrice?.refund?.refundPenalty).toLocaleString()} <small>ریال</small>
                </b>
              ) : (
                '-'
              )}
            </td>
            <td>
              {refundStatus === 'ROOM_STATUS_REFUND_ACCEPTED' ? (
                <b className="color-primary">
                  {Number(refundPrice?.refund?.refundAmount).toLocaleString()} <small>ریال</small>
                </b>
              ) : (
                '-'
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* <div className="p-3">
        <div className="d-flex justify-content-between">
          <span className="color-grey-19">ظرفیت اتاق :</span>
          <span></span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <span className="color-grey-19"> نام سرپرست :</span>
          <span>{fullName}</span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <span className="color-grey-19"> مبلغ رزرو :</span>
          <span className="color-primary">
            <b>
              {Number(price).toLocaleString() || '-'} <small>ریال</small>
            </b>
          </span>
        </div>
        {refundStatus === 'ROOM_STATUS_REFUND_ACCEPTED' && (
          <>
            <div className="d-flex justify-content-between mt-3">
              <span className="color-grey-19"> مبلغ جریمه :</span>
              <span className="color-primary">
                <b>
                  {Number(
                    refundPrice?.refund?.refundPercent,
                  ).toLocaleString() || '-'}{' '}
                  <small>ریال</small>
                </b>
              </span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span className="color-grey-19"> مبلغ استرداد شده به مسافر :</span>
              <span className="color-primary">
                <b>
                  {Number(
                    refundPrice?.refund?.refundAmount,
                  ).toLocaleString() || '-'}{' '}
                  <small>ریال</small>
                </b>
              </span>
            </div>
          </>
        )}
      </div> */}
    </>
  );
};

export default HotelPassengersInfoInDesktop;
