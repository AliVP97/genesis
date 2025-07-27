import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import useCheckedIndex from './useCheckedIndex';
import {
  refundNextStep,
  refundResetStep,
  refundSelectedReasonChanged,
} from 'store/slices/internationalFlight/refund';
import { useMemo } from 'react';
import { selectRefundReasons } from 'store/slices/internationalFlight/selectors/refund';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const useSelectReason = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceDetect();
  const reasons = useAppSelector(selectRefundReasons);
  const { checkedIndex, handleCheckedIndexChange } = useCheckedIndex();

  const data = useMemo(() => reasons.map((reason) => reason.title ?? ''), [reasons]);

  const handleSubmit = () => {
    dispatch(refundSelectedReasonChanged(reasons[checkedIndex]));
    dispatch(refundNextStep());
  };

  const handleCancel = () => {
    dispatch(refundResetStep());
  };

  return {
    data,
    isMobile,
    checkedIndex,
    handleSubmit,
    handleCancel,
    handleCheckedIndexChange,
  };
};

export default useSelectReason;
