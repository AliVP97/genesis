import Modal from 'module/internationalFlight/tickets/FlightDetails/Modal';
import { ArrowRightPurpleIcon } from 'assets/icons';
import styles from './conditions.module.scss';
import { conditionList } from '../conditions/conditionList';
import cn from 'classnames';

type ConditionModalProps = {
  isOpen: boolean;
  onShowModal: (isModalOpen: boolean) => void;
};
const ConditionsModal = ({ isOpen, onShowModal }: ConditionModalProps) => {
  return (
    <>
      {isOpen && (
        <Modal fullScreen className={styles['mobile-tablet-modal']}>
          <div className={cn(styles['app-bar'], 'row justify-content-start')}>
            <div className="col-2">
              <ArrowRightPurpleIcon className={styles.icon} onClick={() => onShowModal(false)} />
            </div>
            <div className="col-8 align-items-center d-flex justify-content-center">
              <span className={cn(styles.title, 'fs-3 ')}>شرایط استفاده استرداد بدون جریمه</span>
            </div>
          </div>

          <ul className="py-4 pe-5 lh-lg">
            {conditionList.map((condition) => (
              <li key={condition.id} className="fs-3">
                {condition.item}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
};

export default ConditionsModal;
