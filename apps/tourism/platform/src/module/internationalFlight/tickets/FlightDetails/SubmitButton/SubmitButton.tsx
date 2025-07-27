import { FC } from 'react';
import styles from './SubmitButton.module.scss';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { internationalFlightCart } from 'store/slices/ecommerce/ecomerceSlice';
import {
  selectFlightDetailsItinerary,
  selectFlightDetailsItineraryIndex,
} from 'store/slices/internationalFlight/selectors/flightDetails';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { selectFlightRequestId } from 'store/slices/internationalFlight/selectors/flight';
import Loader from '../../Loader/Loader';
import { useAuthContext } from 'utils/hooks/useAuthContext';

type SubmitButtonProps = {
  className?: string;
};

const SubmitButton: FC<SubmitButtonProps> = ({ children, className }) => {
  const dispatch = useAppDispatch();
  const { lazyLogin } = useAuthContext();
  const itinerary = useAppSelector(selectFlightDetailsItinerary);
  const { mutateCreateOrder, isCreateOrderLoading } = useCreateOrder();
  const { internationalFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const requestId = useAppSelector(selectFlightRequestId);
  const itineraryIndex = useAppSelector(selectFlightDetailsItineraryIndex);

  const handleClick = async () => {
    try {
      await lazyLogin();

      if (!requestId || !itinerary?.itineraryId) {
        return;
      }

      if (internationalFlightData instanceof Object && 'ticketsData' in internationalFlightData) {
        const CartObject: viewItemListModel = {
          ...(internationalFlightData as viewItemListModel),
          itemPosition: itineraryIndex,
          itinerary,
        };
        const internationalFlightTracking = new FlightInternationalTracking();
        dispatch(internationalFlightCart({ data: CartObject }));
        internationalFlightTracking.addToCart(CartObject);
      }

      mutateCreateOrder({
        requestId: requestId,
        itineraryId: itinerary.itineraryId,
      });
    } catch (error) {}
  };

  return (
    <button
      className={classNames(styles['submit-button'], className)}
      disabled={isCreateOrderLoading}
      onClick={handleClick}
    >
      {!isCreateOrderLoading && children}
      {isCreateOrderLoading && <Loader />}
    </button>
  );
};

export default SubmitButton;
