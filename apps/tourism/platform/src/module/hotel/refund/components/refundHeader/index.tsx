import { BackArrowIcon, CloseIcon } from 'assets/icons';
import styles from '../../refund.module.scss';
import cn from 'classnames';

type RefundHeaderProps = {
  onClose: () => void;
  handleBackSteps: () => void;
};

const RefundHeader = ({ onClose, handleBackSteps }: RefundHeaderProps) => {
  return (
    <>
      <div
        className={cn(
          styles['refund__modal__header'],
          'd-flex  flex-md-row-reverse justify-content-center  justify-content-md-between align-items-center px-2 py-3',
        )}
      >
        <div className="text-center mx-auto mx-md-1">
          <span className="color-on-surface text-weight-500">استرداد</span>
        </div>

        <div className="d-md-none">
          <BackArrowIcon onClick={handleBackSteps} className={cn('fill-tertiary')} />
        </div>

        <div onClick={() => onClose()} role="button" className="d-none d-md-block">
          <CloseIcon />
        </div>
      </div>
    </>
  );
};

export default RefundHeader;
