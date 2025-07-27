import styles from './roomDetailsModal.module.scss';
import { CloseIcon } from 'assets/icons';
import cn from 'classnames';
import Modal from 'module/internationalFlight/tickets/FlightDetails/Modal';
import Card from 'module/internationalFlight/tickets/FlightDetails/Card';
import { breakLines } from 'utils/helpers/breakLines';
import { useEffect } from 'react';

type RoomDetailsModal = {
  roomDetails: string;
  setOpenModal: (value: null | boolean) => void;
};
const RoomDetailsModal = ({ roomDetails, setOpenModal }: RoomDetailsModal) => {
  const useModal = () => {
    useEffect(() => {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    const handleClose = () => {
      setOpenModal(null);
    };

    return {
      handleClose,
    };
  };
  const { handleClose } = useModal();

  return (
    <Modal size="large" className={styles['modal']}>
      <div className={styles['close-container']}>
        <button className={styles['close-button']} onClick={handleClose}>
          <CloseIcon />
        </button>
        <span className="me-2">بستن</span>
      </div>
      <div className={cn('d-flex gap-3', styles['modal-content'])}>
        <div
          className={cn('d-flex flex-column w-100 gap-3 overflow-hidden', styles['card-container'])}
        >
          <Card hasPadding={false} hasBorder={false} className="h-100">
            <div className={styles['card-content']}>{breakLines(roomDetails)}</div>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default RoomDetailsModal;
