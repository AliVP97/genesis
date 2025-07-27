import cn from 'classnames';
import styles from './TicketSummary.module.scss';
import React from 'react';
import { useTicket } from '../TicketContext';
import ToggleTicketDetails from './ToggleTicketDetails';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

function getPrice(value: number | undefined): string | undefined {
  if (!value || isNaN(value)) {
    return undefined;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  });

  return formatter.format(value);
}

interface TicketSummaryProps {
  handleShowDetails: () => void;
}

export default function TicketSummary({ handleShowDetails }: TicketSummaryProps) {
  const { itinerary, summaryTitle } = useTicket();
  const { availableSeat, priceInfo } = itinerary ?? {};
  const price = getPrice(priceInfo?.price);
  const { isMobile } = useDeviceDetect();

  return (
    <div
      className={cn(
        styles.root,
        'p-3 pb-4 justify-content-lg-center justify-content-between d-flex align-items-center flex-md-column col-lg-3',
      )}
    >
      {!summaryTitle && (
        <span
          className={cn(
            styles['title'],
            availableSeat! <= 10 ? 'color-red' : 'color-grey',
            'fw-500',
          )}
        >
          فقط {availableSeat!} صندلی باقی مانده
        </span>
      )}
      {summaryTitle && (
        <span className={cn(styles['title'], 'color-grey', 'fw-500')}>{summaryTitle}</span>
      )}
      {Boolean(price) && (
        <div>
          <span className={cn(styles['total-price'], 'ltr d-inline-block ms-1')}>{price} </span>
          <span className={styles.currency}>ریال</span>
        </div>
      )}
      {!isMobile && <ToggleTicketDetails onClick={handleShowDetails} />}
    </div>
  );
}
