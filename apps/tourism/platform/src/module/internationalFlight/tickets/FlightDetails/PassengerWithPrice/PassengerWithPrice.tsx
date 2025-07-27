import { useAppSelector } from 'store/hook/storeHook';
import styles from './PassengerWithPrice.module.scss';
import { selectFlightDetailsItinerary } from 'store/slices/internationalFlight/selectors/flightDetails';
import cn from 'classnames';
import formatPrice from '../utils/formatPrice';
import PassengerDetails from './PassengerDetails';

const PassengerWithPrice = () => {
  const itinerary = useAppSelector(selectFlightDetailsItinerary);
  const totalPrice = itinerary?.priceInfo?.price;
  const fareBreakdowns = itinerary?.fareBreakdowns;

  return (
    <div className={cn(styles['passenger-with-price'], 'd-flex flex-column gap-3')}>
      {fareBreakdowns?.map((fareBreakdown, key) => (
        <PassengerDetails {...fareBreakdown} key={key} />
      ))}
      <div className={styles['divider']}></div>
      <div className={cn(styles['total-price'], 'd-flex justify-content-between')}>
        <span>مجموع مبلغ</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
};

export default PassengerWithPrice;
