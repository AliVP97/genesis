import Image from 'next/image';
import { useState } from 'react';
import { customLoader } from 'utils/helpers/imageLoader';
import SuggestionFlightsModal from '../suggestion-flights-modal';
import Button from 'components/button';
import { TicketList, TicketType } from 'module/flights/tickets/ticket/interface';
import { ArrowLeftPrimaryColor } from 'assets/icons';
import { SuggestionFlightsImg } from 'assets/images';
import styles from './suggestion.module.scss';
import { NumberSeparator } from 'utils/helpers/numbers';

type SuggestionProps = {
  isLoading: boolean;
  tickets: TicketList;
  onSelectTicket: (data: TicketType) => void;
  returning: boolean;
  oneWay: boolean;
  isMobile?: boolean;
  isReturn?: boolean;
};

const SuggestionFlights = ({
  isLoading,
  tickets,
  onSelectTicket,
  returning,
  oneWay,
  isMobile,
  isReturn,
}: SuggestionProps) => {
  const [suggestionFlightsModal, setSuggestionFlightsModal] = useState(false);
  return (
    <>
      <section className={styles['container']}>
        <div className={styles['fixed-box']}>
          <p>
            {' '}
            پروازهای پیشنهادی
            <br />
            در بازه ۷ روز <br className={styles['new-line']} />
            از تاریخ انتخابی شما
            <span className={styles['display-colon']}>:</span>
          </p>
          <Image
            loader={customLoader}
            src={SuggestionFlightsImg}
            alt="پروازهای پیشنهادی"
            width={isMobile ? 112 : 200}
            height={isMobile ? 75 : 133}
            unoptimized
            className={styles['suggestion-flights-img']}
          />
        </div>
        <article className={styles['flights-info-box']}>
          <section>
            <div className={styles['flight-info']}>
              <span className="ms-2">{tickets[0].categoryTitle}</span>
              <span>{tickets[0].departure?.dateString}</span>
            </div>
            <div className={styles['flight-info']}>
              <span className="ms-2">{tickets[1].categoryTitle}</span>
              <span className={styles['flight-info__price']}>
                {NumberSeparator(tickets[1].price?.toString() || '0')} ریال
              </span>
            </div>
          </section>
          <Button
            radius
            className={styles['flights-info-box__button']}
            btnType="button"
            onClick={() => setSuggestionFlightsModal(true)}
          >
            <span className={styles['flights-info-box__button__text']}>
              مشاهده پروازهای پیشنهادی
            </span>{' '}
            <div className="ms-3">
              <ArrowLeftPrimaryColor className={styles['flights-info-box__button__icon']} />
            </div>
          </Button>
        </article>
      </section>
      <SuggestionFlightsModal
        visible={suggestionFlightsModal}
        onClose={() => setSuggestionFlightsModal(false)}
        oneWay={oneWay}
        returning={returning}
        onSelectTicket={onSelectTicket}
        tickets={tickets}
        isLoading={isLoading}
        isReturn={isReturn}
        isMobile={isMobile}
      />
    </>
  );
};
export default SuggestionFlights;
