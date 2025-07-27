import Modal from 'components/modal';
import { Suggestion } from '../Suggestion';
import Button from 'components/button';
import { TicketList, TicketType } from 'module/flights/tickets/ticket/interface';
import { CloseIcon, BackArrowIcon } from 'assets/icons';
import styles from './suggestion-modal.module.scss';

type SuggestionFlightsModalProps = {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
  tickets: TicketList;
  onSelectTicket: (data: TicketType) => void;
  returning: boolean;
  oneWay: boolean;
  isMobile?: boolean;
  isReturn?: boolean;
};

const SuggestionFlightsModal = ({
  visible,
  onClose,
  isLoading,
  tickets,
  onSelectTicket,
  returning,
  oneWay,
  isMobile,
  isReturn,
}: SuggestionFlightsModalProps) => {
  const departureCity = tickets[0]?.departure?.airport?.city?.name?.farsi;
  const arrivalCity = tickets[0]?.arrival?.airport?.city?.name?.farsi;
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      backdropDisable={false}
      className={styles['main-modal-style']}
    >
      <section className={styles['container']}>
        <header className={styles['mobile-head-line']}>
          <p className="m-0">
            {departureCity} - {arrivalCity}
          </p>
          <BackArrowIcon className={styles['back-icon']} onClick={onClose} />
        </header>
        <header dir="rtl" className={styles['header']}>
          <span className={styles['title']}>
            پیشنهادهای هف‌هشتاد، در بازه ۷ روز از تاریخ انتخابی شما:
          </span>
          <div className={styles['close-icon']} onClick={onClose}>
            <CloseIcon />
          </div>
        </header>
        <Suggestion
          visible={visible}
          oneWay={oneWay}
          returning={returning}
          onSelectTicket={onSelectTicket}
          tickets={tickets}
          isLoading={isLoading}
          isReturn={isReturn}
          isMobile={isMobile}
        />
        <Button
          radius
          className={styles['mobile-modal-close-btn']}
          btnType="button"
          onClick={onClose}
        >
          <span>بازگشت</span>
        </Button>
      </section>
    </Modal>
  );
};
export default SuggestionFlightsModal;
