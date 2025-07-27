import cn from 'classnames';
import styles from './ToggleTicketDetails.module.scss';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'store/hook/storeHook';
import { selectFlightDetailsItinerary } from 'store/slices/internationalFlight/selectors/flightDetails';
import Loader from '../../Loader/Loader';

interface ToggleTicketDetailsProps {
  onClick: () => void;
}

const ToggleTicketDetails = ({ onClick }: ToggleTicketDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const itinerary = useAppSelector(selectFlightDetailsItinerary);

  useEffect(() => {
    setIsLoading(false);
  }, [itinerary]);

  const handleClick = () => {
    onClick();
    setIsLoading(true);
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className={cn('btn btn-outline-primary rounded-pill', styles.root)}
    >
      <div className={'d-flex flex-column justify-content-between align-items-center'}>
        {!isLoading && <>مشاهده جزئیات و خرید</>}
        {isLoading && <Loader />}
      </div>
    </button>
  );
};

export default ToggleTicketDetails;
