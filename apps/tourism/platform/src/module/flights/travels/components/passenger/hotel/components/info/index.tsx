import { TTripsHotelPriceDetail, TTripsRoomStatus } from 'services/trips/types';

interface THotelPassengersInfoProps {
  capacity?: string;
  firstName: string;
  lastName: string;
  price?: number;
  refundStatus: TTripsRoomStatus;
  refundPrice?: TTripsHotelPriceDetail;
}

const HotelPassengersInfo = ({
  capacity,
  firstName,
  lastName,
  price,
  refundStatus,
  refundPrice,
}: THotelPassengersInfoProps) => {
  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <span className="color-on-surface">ظرفیت اتاق :</span>
          <span>{capacity || '-'} نفر</span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <span className="color-on-surface"> نام سرپرست :</span>
          <span>
            {firstName}
            {lastName}
          </span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <span className="color-on-surface"> مبلغ رزرو :</span>
          <span className="color-primary">
            <b>
              {Number(price).toLocaleString() || '-'} <small>ریال</small>
            </b>
          </span>
        </div>
        {refundStatus === 'ROOM_STATUS_REFUND_ACCEPTED' && (
          <>
            <div className="d-flex justify-content-between mt-3">
              <span className="color-on-surface"> مبلغ جریمه :</span>
              <span className="color-primary">
                <b>
                  {Number(refundPrice?.refund?.refundPenalty).toLocaleString() || '-'}{' '}
                  <small>ریال</small>
                </b>
              </span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span className="color-on-surface"> مبلغ استرداد شده به مسافر :</span>
              <span className="color-primary">
                <b>
                  {Number(refundPrice?.refund?.refundAmount).toLocaleString() || '-'}{' '}
                  <small>ریال</small>
                </b>
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HotelPassengersInfo;
