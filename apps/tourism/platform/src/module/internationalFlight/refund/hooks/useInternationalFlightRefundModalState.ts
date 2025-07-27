import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { refundModalStateChanged } from 'store/slices/internationalFlight/refund';
import { selectRefundModalState } from 'store/slices/internationalFlight/selectors/refund';

/**
 * This hook is used to control the state of the international flight refund
 * modal and it is included the loading, open and close modal.
 * @returns states and functions for the international flight refund modal
 */
const useInternationalFlightRefundModalState = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(selectRefundModalState);
  const isInternationalFlightModalVisible = ['open', 'loading'].includes(modalState);

  const setInternationalFlightModalLoading = useCallback(() => {
    dispatch(refundModalStateChanged('loading'));
  }, [dispatch]);

  return {
    internationalFlightModalState: modalState,
    isInternationalFlightModalVisible,
    setInternationalFlightModalLoading,
  };
};

export default useInternationalFlightRefundModalState;
