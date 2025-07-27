import cn from 'classnames';
import { InfoIcon } from 'assets/icons';
import router from 'next/router';
import Button from 'components/button';
import styles from '../../styles/invoice.module.scss';
import { TBusOrder } from 'services/bus/order/interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface TSubmitProps {
  order: TBusOrder;
  handlePaymentButton: () => void;
  isLoading: boolean;
  allowSubmit?: boolean;
}

const Submit = ({ order, handlePaymentButton, isLoading, allowSubmit }: TSubmitProps) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div dir="rtl" className="bg-color-white-2 pb-3">
      <div className={cn(styles['invoice__table'], 'mx-auto d-flex row p-3')}>
        <div className="d-flex justify-content-start pb-3 col-lg-6 col-md-12">
          <div>
            <InfoIcon className="fill-grey-2" />
          </div>
          <span className="text-3 me-1">
            ادامه فرایند خرید، به منزله تایید
            <a
              className="text-decoration-none"
              href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}
            >
              قوانین و مقررات
            </a>{' '}
            سازمان اتوبوسرانی و سایت هف‌هشتاد، توسط شما می‌باشد.
          </span>
        </div>
        <div className="d-flex justify-content-end col-lg-6 col-md-12">
          <Button
            btnType="submit"
            onClick={() => router.back()}
            className={cn(
              styles['invoice__table__footer-btn'],
              'btn bg-white color-grey-1 mx-3 d-none d-md-block',
            )}
            radius
          >
            بازگشت
          </Button>
          <Button
            btnType="submit"
            onClick={handlePaymentButton}
            className={cn(styles['invoice__table__footer-btn'], 'btn btn-primary border-0')}
            radius
            loading={isLoading}
            disabled={!allowSubmit}
          >
            <div className="d-flex flex-row w-100 text-center d-none d-md-block">
              پرداخت {Number(order?.totalPrice)?.toLocaleString()} ریال
            </div>
            <div className="d-flex flex-row w-100 text-center align-items-center justify-content-center d-md-none">
              {isMobile ? 'ادامه و پرداخت' : 'تایید و پرداخت'}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Submit;
