import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import SubmitButton from '../SubmitButton';
import styles from './PriceBottomSheet.module.scss';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import {
  selectFlightDetailsHasSubmitButton,
  selectFlightDetailsIsPriceBottomSheetOpen,
  selectFlightDetailsItinerary,
} from 'store/slices/internationalFlight/selectors/flightDetails';
import formatPrice from '../utils/formatPrice';
import { flightDetailsIsPriceBottomSheetOpenChanged } from 'store/slices/internationalFlight/flightDetails';
import PassengerDetails from '../PassengerWithPrice/PassengerDetails';
import { useMemo } from 'react';

const PriceBottomSheet = () => {
  const dispatch = useAppDispatch();
  const itinerary = useAppSelector(selectFlightDetailsItinerary);
  const isOpen = useAppSelector(selectFlightDetailsIsPriceBottomSheetOpen);
  const fareBreakdowns = useMemo(
    () => itinerary?.fareBreakdowns?.filter((fareBreakdown) => fareBreakdown.count),
    [itinerary],
  );
  const totalPrice = itinerary?.priceInfo?.price;
  const hasSubmitButton = useAppSelector(selectFlightDetailsHasSubmitButton);

  const handleOpenClick = () => {
    dispatch(flightDetailsIsPriceBottomSheetOpenChanged(!isOpen));
  };

  return (
    <div className={classNames(styles['price-bottom-sheet'], isOpen && styles['__open'])}>
      {isOpen &&
        fareBreakdowns?.map((fareBreakdown, index) => (
          <div
            key={index}
            className={classNames('d-flex justify-content-between', styles['passenger-details'])}
          >
            <PassengerDetails key={index} {...fareBreakdown} />
          </div>
        ))}
      <div
        className={classNames(
          'd-flex gap-2 align-items-center',
          styles['content'],
          isOpen && styles['__open'],
        )}
      >
        <div className="w-100 d-flex flex-column">
          <div className="mb-1" onClick={handleOpenClick}>
            <span className={styles['final-amount']}>مبلغ نهایی</span>
            {isOpen && <ArrowDownIcon className={styles['arrow-icon']} />}
            {!isOpen && <ArrowUpIcon className={styles['arrow-icon']} />}
          </div>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        {hasSubmitButton && <SubmitButton className="w-100">انتخاب بلیط و ادامه</SubmitButton>}
      </div>
    </div>
  );
};

export default PriceBottomSheet;
