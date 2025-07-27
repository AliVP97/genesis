import Button from 'components/button';
import cn from 'classnames';
import styles from '../notification/notification.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type TConfirmRefund = {
  onClose: () => void;
  handleClick: () => void;
  internationalHotelRefundLoading?: boolean;
};

const ConfirmRefund = ({
  onClose,
  handleClick,
  internationalHotelRefundLoading,
}: TConfirmRefund) => {
  const device = useDeviceDetect();

  return (
    <>
      <div className="p-4 rtl lh-lg">
        <p>آیا از ثبت درخواست استرداد خود اطمینان دارید؟</p>

        <div
          className={`text-start d-flex ${
            device.isMobile
              ? 'justify-content-between'
              : 'justify-content-end gap-2 mt-3'
          } `}
        >
          <Button
            className={cn(
              styles['notification-btn'],
              'border border-dark text-black px-5',
            )}
            onClick={() => onClose()}
          >
            انصراف{' '}
          </Button>
          <Button
            className={cn(styles['notification-btn'], 'bg-color-primary px-4')}
            onClick={handleClick}
            loading={internationalHotelRefundLoading}
          >
            ثبت درخواست{' '}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmRefund;
