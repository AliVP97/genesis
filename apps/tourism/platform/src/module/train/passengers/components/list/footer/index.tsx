import cn from 'classnames';
import Router from 'next/router';

import { InfoIcon } from 'assets/icons';
import Button from 'components/button';

import styles from './footer.module.scss';

type TFooterProps = {
  allowSubmit: boolean;
  isLoadingOptionalServices: boolean;
  isOrderPassengerLoading: boolean;
  handleSubmitPassengers: () => void;
};

const Footer = ({
  allowSubmit,
  handleSubmitPassengers,
  isLoadingOptionalServices,
  isOrderPassengerLoading,
}: TFooterProps) => {
  return (
    <>
      <div
        className={cn(
          styles['footer'],
          'd-flex flex-row justify-content-between bg-color-white p-4 align-items-center rtl',
        )}
      >
        <div className="col-6">
          <InfoIcon className={styles['footer__icon']} />
          <span className="text-3 me-2">
            ادامه فرایند خرید به منزله تایید{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}
              target="_blank"
              rel="noreferrer"
            >
              قوانین و مقررات
            </a>{' '}
            راه آهن جمهوری اسلامی و سایت هف‌هشتاد توسط شما می باشد.
          </span>
        </div>
        <div className="col-6 ltr">
          <Button
            className={cn(
              styles['footer__btn'],
              'color-white text-3 py-2 px-4 border-0 me-3',
              allowSubmit ? 'bg-color-primary' : 'bg-color-grey-1',
            )}
            disabled={!allowSubmit}
            onClick={handleSubmitPassengers}
            loading={isLoadingOptionalServices || isOrderPassengerLoading}
          >
            <span>تایید و ادامه</span>
          </Button>
          <Button
            className={cn(styles['footer__btn'], 'bg-color-white color-grey-1 text-3 py-2 px-4')}
            onClick={() => Router.back()}
          >
            <span>بازگشت</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Footer;
