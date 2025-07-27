import { BackArrowIcon, CloseIcon } from 'assets/icons';
import cn from 'classnames';
import { TSteps } from '../../types';
import styles from '../../../refund.module.scss';

type RefundHeaderProps = {
  onClose: () => void;
  handleBackSteps: () => void;
  step: TSteps;
};

const RefundHeader = ({ onClose, handleBackSteps, step }: RefundHeaderProps) => {
  return (
    <>
      <div
        className={cn(
          styles['refund__modal__header'],
          'd-flex  flex-md-row-reverse justify-content-center  justify-content-md-between align-items-center px-2 py-3',
        )}
      >
        <div className="text-center mx-auto mx-md-1">
          <span className="color-on-surface text-weight-500">
            {step === 'detail' ? 'جزئیات استرداد' : 'استرداد'}
          </span>
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
