import styles from './TripDirectionButtons.module.scss';
import {
  selectFlightDetailsIsRoundTrip,
  selectFlightDetailsTripDirection,
} from 'store/slices/internationalFlight/selectors/flightDetails';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { TRIP_DIRECTIONS } from '../constants/common';
import { flightDetailsTripDirectionChanged } from 'store/slices/internationalFlight/flightDetails';
import { TripDirection } from '../types/common';
import cn from 'classnames';
import TripDirectionButton from './TripDirectionButton';

const TripDirectionButtons = () => {
  const dispatch = useAppDispatch();
  const tripDirection = useAppSelector(selectFlightDetailsTripDirection);
  const isRoundTrip = useAppSelector(selectFlightDetailsIsRoundTrip);

  if (!isRoundTrip) {
    return null;
  }

  const handleClick = (value: TripDirection) => () => {
    dispatch(flightDetailsTripDirectionChanged(value));
  };

  return (
    <div className={cn('d-flex flex-row', styles['trip-buttons'])}>
      <TripDirectionButton
        onClick={handleClick(TRIP_DIRECTIONS.LEAVING)}
        active={tripDirection === TRIP_DIRECTIONS.LEAVING}
      >
        مسیر رفت
      </TripDirectionButton>
      <TripDirectionButton
        onClick={handleClick(TRIP_DIRECTIONS.RETURNING)}
        active={tripDirection === TRIP_DIRECTIONS.RETURNING}
      >
        مسیر برگشت
      </TripDirectionButton>
    </div>
  );
};

export default TripDirectionButtons;
