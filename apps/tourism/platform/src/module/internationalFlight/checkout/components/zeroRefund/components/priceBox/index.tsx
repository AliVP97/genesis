import GetOrderResponseV2 from '../../../../types/GetOrderResponseV2';
import cn from 'classnames';
import styles from '../../../../styles/invoice.module.scss';

type PriceBoxProps = {
  order: GetOrderResponseV2;
};

const PriceBox = ({ order }: PriceBoxProps) => {
  const zeroRefund = order?.order?.services?.[0]?.serviceDetail?.[0];
  return (
    <div
      className={cn(
        styles['price-box'],
        'd-flex justify-content-between align-items-center bg-color-grey-12 px-3 py-1 rounded-5 color-on-surface',
      )}
    >
      <div className="d-flex flex-column">
        <span className="py-2">
          {' '}
          هزینه برای
          <span> {order?.order?.passengers?.length} </span>
          مسافر
        </span>
        <span className={cn(styles['color-on-surface-var'])}>
          {String(order?.order?.itinerary?.tripMode) === 'TRIP_MODE_ROUND_TRIP' && 'رفت و برگشت'}
        </span>
      </div>
      <span className="fs-4">
        {Number(zeroRefund?.price)?.toLocaleString()} {zeroRefund?.priceComment}
      </span>
    </div>
  );
};

export default PriceBox;
