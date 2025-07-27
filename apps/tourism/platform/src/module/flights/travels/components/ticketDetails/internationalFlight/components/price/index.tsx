import classNames from 'classnames';
import { TInternationalTripMode } from 'services/internationalFlight/flight/interface';
import styles from './price.module.scss';

type TInternationalFlightPriceDetailsProps = {
  price: number | undefined;
  type: TInternationalTripMode;
};

const InternationalFlightPriceDetails = ({
  price,
  type,
}: TInternationalFlightPriceDetailsProps) => {
  const getPriceLabel = (type: number): string | null => {
    if (type === 1) return 'مجموع قیمت';
    if (type === 2) return 'مجموع قیمت رفت و برگشت';
    return null;
  };
  return (
    <>
      <div
        className={classNames(
          'd-flex justify-content-between p-3 mb-4',
          styles['international-ticket-info-price'],
        )}
      >
        <span>{getPriceLabel(type)}</span>
        <span className="color-primary">
          <b>{price && Number(price).toLocaleString()}</b> ریال
        </span>
      </div>
    </>
  );
};

export default InternationalFlightPriceDetails;
