import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import {
  refundResetStep,
  refundSetup,
  SetupPayload,
} from 'store/slices/internationalFlight/refund';
import { selectRefundStep } from 'store/slices/internationalFlight/selectors/refund';
import { RefundProps } from '../components/Refund';
import useGetOrderForRefund from './useGetOrderForRefund';
import { GetOrderForRefundResponse } from '../types/api';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import classNames from 'classnames';
import styles from '../components/Refund.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const createSetup = (data: GetOrderForRefundResponse, orderId: string): SetupPayload => ({
  orderId,
  reasons: data.refundReasons ?? [],
  itineraries: data.itineraries ?? [],
});

const useRefund = ({ orderId }: RefundProps) => {
  const { data, isSuccess } = useGetOrderForRefund(orderId);
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectRefundStep);
  const isSuperApp = useIsSuperApp();
  const { isMobile } = useDeviceDetect();
  const modalClassname = classNames(
    styles.modal,
    isSuperApp && isMobile && styles['modal-super-app'],
  );

  useEffect(() => {
    if (data) {
      dispatch(refundSetup(createSetup(data, orderId)));
    }
  }, [data, dispatch, orderId]);

  const handleClose = () => {
    dispatch(refundResetStep());
  };

  return { step, isSuccess, modalClassname, isMobile, handleClose };
};

export default useRefund;
