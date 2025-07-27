import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';

import styles from '../../../refund.module.scss';
import DesktopRefundInfo from '../refundInfo';

type RefundFooterProps = {
  onClose: () => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  loading: boolean;
  selectedTickets: boolean;
};

const RefundFooter = ({
  handleBackStep,
  handleNextStep,
  loading,
  selectedTickets,
}: RefundFooterProps) => {
  return (
    <>
      <div className="py-3">
        <Divider type="horizontal" className="d-none d-md-block" />
        <div
          className={cn(
            'w-100 d-flex justify-content-between align-items-center px-md-3 rtl h-100',
          )}
        >
          <div className="d-none d-md-block">
            <DesktopRefundInfo />
          </div>

          <div
            className={cn(
              styles['refund__modal__group-button'],
              'd-flex justify-content-end align-items-center mt-3',
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
              disabled={!selectedTickets || loading}
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

export default RefundFooter;
