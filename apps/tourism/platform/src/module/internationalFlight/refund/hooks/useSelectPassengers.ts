import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import {
  selectRefundItineraryPassengers,
  selectRefundPreConfirmData,
} from 'store/slices/internationalFlight/selectors/refund';
import { ConfirmRefundRequest } from '../types/api';
import useConfirmRefund from './useConfirmRefund';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { refundResetStep } from 'store/slices/internationalFlight/refund';

const useSelectPassengers = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceDetect();
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
  const { mutate, data, isLoading } = useConfirmRefund();
  const passengers = useAppSelector(selectRefundItineraryPassengers);
  const preConfirmData = useAppSelector(selectRefundPreConfirmData);
  const [dialogState, setDialogState] = useState<{
    status: 'success' | 'error';
    messages: string[];
  } | null>(null);
  const canSubmit = checkedIndexes.length > 0 && isLoading === false;

  useEffect(() => {
    if (data) {
      const { isSuccess, messages } = data.baseResponse ?? {};
      setDialogState({
        messages: messages ?? [],
        status: isSuccess ? 'success' : 'error',
      });
    }
  }, [data]);

  const handleSubmit = () => {
    const payload: ConfirmRefundRequest = {
      selectedPassengersForRefund: checkedIndexes.map((index) => passengers[index].id ?? ''),
      ...preConfirmData,
    };

    mutate(payload);
  };

  const handleCancel = () => {
    dispatch(refundResetStep());
  };

  const handleChangeCheckedIndexes = useCallback(
    (index: number) => (checked: boolean) => {
      setCheckedIndexes((prev) => (checked ? [...prev, index] : prev.filter((i) => i !== index)));
    },
    [],
  );

  const handleDialogClose = () => {
    if (!data?.baseResponse?.isSuccess) {
      setDialogState(null);
    } else {
      handleCancel();
    }
  };

  return {
    isMobile,
    canSubmit,
    dialogState,
    handleSubmit,
    handleCancel,
    checkedIndexes,
    handleDialogClose,
    handleChangeCheckedIndexes,
  };
};

export default useSelectPassengers;
