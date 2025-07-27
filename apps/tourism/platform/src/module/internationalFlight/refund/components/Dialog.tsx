import { InfoIcon } from 'assets/icons';
import classNames from 'classnames';
import Modal from 'module/internationalFlight/tickets/FlightDetails/Modal';
import styles from './Dialog.module.scss';
import Button from './Button';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import DesktopModalFooter from './DesktopModalFooter';

type DialogProps = {
  messages: string[];
  onClose?: () => void;
  status: 'confirm' | 'error' | 'success';
};

const Dialog = ({ messages, onClose }: DialogProps) => {
  const { isMobile } = useDeviceDetect();

  return (
    <Modal
      fullScreen
      className={classNames(styles.dialog, 'd-flex justify-content-center align-items-center')}
      backdropClassName={styles.dialog}
    >
      <div className={classNames(styles['modal-content'], isMobile && 'pb-4')}>
        <div className={classNames('d-flex flex-row', !isMobile && 'pe-4 ps-4 pt-3')}>
          <InfoIcon className={classNames(styles.icon, 'flex-shrink-0')} />
          {messages.map((message, index) => (
            <p className={styles.message} key={index}>
              {message}
            </p>
          ))}
        </div>
        <div className="d-flex w-100">
          {isMobile && (
            <Button className="mt-auto me-auto" onClick={onClose}>
              متوجه شدم
            </Button>
          )}
        </div>
        {!isMobile && (
          <DesktopModalFooter>
            <Button className="mt-auto" onClick={onClose}>
              متوجه شدم
            </Button>
          </DesktopModalFooter>
        )}
      </div>
    </Modal>
  );
};

export default Dialog;
