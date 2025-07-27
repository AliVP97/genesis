import styles from './DesktopModal.module.scss';
import { CloseIcon } from 'assets/icons';
import Card from '../Card/Card';
import TripDirectionButtons from '../TripDirectionButtons';
import TabPanels from '../TabPanels';
import TabButtons from '../TabButtons';
import PassengerWithPrice from '../PassengerWithPrice';
import cn from 'classnames';
import useModal from '../hooks/useModal';
import Modal from '../Modal';
import SubmitButton from '../SubmitButton';
import { useAppSelector } from 'store/hook/storeHook';
import { selectFlightDetailsHasSubmitButton } from 'store/slices/internationalFlight/selectors/flightDetails';

const DesktopModal = () => {
  const { handleClose } = useModal();
  const hasSubmitButton = useAppSelector(selectFlightDetailsHasSubmitButton);

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
            <TripDirectionButtons />
            <TabButtons />
            <TabPanels />
          </Card>
        </div>
        <Card className={styles['left-card']}>
          <PassengerWithPrice />
          {hasSubmitButton && <SubmitButton>انتخاب بلیط</SubmitButton>}
        </Card>
      </div>
    </Modal>
  );
};

export default DesktopModal;
