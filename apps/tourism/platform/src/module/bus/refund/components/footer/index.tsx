import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';

import styles from '../../refund.module.scss';
import RefundPolicy from './refundPolicy';

type FooterProps = {
  onClose: () => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  loading: boolean;
};

const Footer = ({ handleBackStep, handleNextStep, loading }: FooterProps) => {
  return (
    <>
      <div className="pt-3 rtl">
        <Divider type="horizontal" className="d-none d-md-block" />
        <div
          className={cn(
            'w-100 d-flex justify-content-end justify-content-md-between justify-content-end align-items-center px-md-3 rtl h-100',
          )}
        >
          <div className="d-none d-md-block">
            <RefundPolicy />
          </div>

          <div
            className={cn(
              styles['refund__modal__group-button'],
              'd-flex justify-content-between align-items-center mt-3',
            )}
          >
            <Button
              radius
              className={cn(
                styles['refund__modal__prev-btn'],
                'mx-1 bg-color-surface d-none d-md-block',
              )}
              onClick={handleBackStep}
            >
              <span className={cn(styles['refund__modal__prev-btn_text'])}>بازگشت</span>
            </Button>

            <Button
              loading={loading}
              radius
              className={cn(styles['refund__modal__next-btn'], 'mx-1')}
              onClick={handleNextStep}
            >
              تایید
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
