import Button from 'components/button';
import styles from './notification.module.scss';
import cn from 'classnames';
import {TIntHotelRoomRefundResponse} from 'services/hotel/refund/interface';

interface INotification {
  onClose: () => void;
  internationalHotelRefundData?: TIntHotelRoomRefundResponse;
  hotelType?: string;
}

const Notification = ({
  onClose,
  internationalHotelRefundData,
  hotelType,
}: INotification) => {
  return (
    <>
      <div className="p-4 rtl lh-lg">
        {hotelType === 'INTERNATIONAL_HOTEL' ? (
          <p>{internationalHotelRefundData?.message}</p>
        ) : (
          <p>درخواست استرداد شما با موفقیت ثبت شد، و در حال بررسی می باشد.</p>
        )}

        <div className="text-start">
          <Button
            className={cn(
              styles['notification-btn'],
              'bg-color-primary color-on-primary px-4',
            )}
            onClick={() => onClose()}
          >
            متوجه شدم
          </Button>
        </div>
      </div>
    </>
  );
};

export default Notification;
