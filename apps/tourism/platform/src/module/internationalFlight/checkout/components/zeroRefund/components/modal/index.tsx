import { InfoIcon } from 'assets/icons';
import Modal from 'module/internationalFlight/tickets/FlightDetails/Modal';
import cn from 'classnames';
import styles from './styles.module.scss';

type ConfirmModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  setZeroRefund: (checked: boolean) => void;
  cancelSettingZeroRefund: () => void;
};
const ConfirnModal = ({
  isModalOpen,
  setZeroRefund,
  cancelSettingZeroRefund,
  onClose,
}: ConfirmModalProps) => {
  return (
    <>
      {isModalOpen && (
        <Modal
          onClose={() => {
            cancelSettingZeroRefund();
            onClose();
          }}
          className={cn('d-flex justify-content-center align-items-center', styles.container)}
        >
          <div
            style={{ width: '85%', maxWidth: '400px' }}
            className="d-flex flex-column bg-color-white rounded-5 p-3"
          >
            <div className="d-flex flex-row-reverse">
              <InfoIcon style={{ width: '40px' }} />
              <div className={cn('mb-4 fs-3 text-right me-2')}>
                با فعال کردن استرداد بدون جریمه، کدتخفیف وارد شده حذف و غیر فعال خواهد شد
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-5 py-2 fs-3"
                onClick={() => setZeroRefund(true)}
              >
                تایید
              </button>
              <button
                onClick={cancelSettingZeroRefund}
                type="button"
                className="btn btn-light rounded-pill px-5 py-2 fs-3"
              >
                انصراف
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ConfirnModal;
