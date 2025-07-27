import Modal from 'module/internationalFlight/tickets/FlightDetails/Modal';
import AppBar from './AppBar';
import styles from './Refund.module.scss';
import SelectPath from './SelectPath';
import useRefund from '../hooks/useRefund';
import { STEPS } from '../types/common';
import SelectReason from './SelectReason';
import SelectPassengers from './SelectPassengers';
import classNames from 'classnames';

export type RefundProps = {
  orderId: string;
};

const Refund = (props: RefundProps) => {
  const { step, modalClassname, isMobile, handleClose, isSuccess } = useRefund(props);

  if (!isSuccess) {
    return null;
  }

  return (
    <Modal
      size={!isMobile ? 'large' : undefined}
      fullScreen={isMobile}
      className={classNames(modalClassname, styles['modal-desktop'])}
      backdropClassName={modalClassname}
    >
      <div className={styles.content}>
        <AppBar onClose={handleClose} />
        {step === STEPS.SELECT_PATH && <SelectPath />}
        {step === STEPS.SELECT_REASON && <SelectReason />}
        {step === STEPS.SELECT_PASSENGERS && <SelectPassengers />}
      </div>
    </Modal>
  );
};

export default Refund;
