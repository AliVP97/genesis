import { useEffect } from 'react';
import { useAppDispatch } from 'store/hook/storeHook';
import { flightDetailsDataChanged } from 'store/slices/internationalFlight/flightDetails';

const useModal = (onClose?: () => void) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    onClose?.();
    dispatch(flightDetailsDataChanged(null));
  };

  return {
    handleClose,
  };
};

export default useModal;
