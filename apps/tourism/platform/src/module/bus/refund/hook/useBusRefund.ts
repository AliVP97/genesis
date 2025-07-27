import { Dispatch, SetStateAction } from 'react';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { busRefund } from 'services/bus/refund';
import { TBusRefundReasonType } from 'services/bus/refund/interface';
import { definitions } from 'types/bus';
import { notify } from 'utils/notification';
import { BusRefundMessage, TSteps } from '../types';

const UseBusRefund = (
  setStep: Dispatch<SetStateAction<TSteps>>,
  setFinalResultMessage: Dispatch<SetStateAction<BusRefundMessage>>,
) => {
  const refundHandler = (orderId: string, selectedReason: TBusRefundReasonType) => {
    refundMutate({
      orderId: orderId!,
      refundReason: selectedReason,
    });
  };

  const {
    isLoading: refundLoading,
    data: refundData,
    mutate: refundMutate,
    isSuccess: refundSuccess,
  } = useMutation({
    mutationFn: busRefund,
    onSuccess: () => {
      setFinalResultMessage(BusRefundMessage.SUCCESS);
      setStep('finalMessage');
    },
    onError: (err: AxiosError<definitions['rpcStatus']>) => {
      notify({
        type: 'error',
        message: err.response?.data?.message || 'مشکلی رخ داده است',
      });
    },
  });
  return { refundHandler, refundLoading, refundData, refundSuccess };
};

export default UseBusRefund;
