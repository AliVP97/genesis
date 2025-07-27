import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';
import styles from '../../refund.module.scss';

type RefundFooterProps = {
  onClose: () => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const RefundFooter = ({ handleBackStep, handleNextStep, loading, disabled }: RefundFooterProps) => {
  return (
    <>
      <div className="py-3">
        <Divider type="horizontal" className="d-none d-md-block" />
        <div
          className={cn(
            'w-100 d-flex justify-content-between align-items-center px-md-3 rtl h-100',
          )}
        >
          <div
            className={cn(
              styles['refund__modal__group-button'],
              'd-flex justify-content-start align-items-center mt-3',
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
              disabled={disabled}
            >
              مرحله بعد
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundFooter;
