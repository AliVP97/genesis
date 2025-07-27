import { useMutation } from 'react-query';
import { busCalcRefund } from 'services/bus/refund';
// import {notify} from 'utils/notification';

const UseBusRefundCalculate = () => {
  const calcRefundHandler = (orderId: string, selectedReason: string) => {
    calcRefundMutate({
      orderId: orderId!,
      refundReason: selectedReason,
    });
  };
  const {
    isLoading: calcRefundLoading,
    isSuccess: calcRefundIsSuccess,
    data: calcRefundData,
    mutate: calcRefundMutate,
    error: calcRefundError,
  } = useMutation({
    mutationFn: busCalcRefund,
    onError: () => {
      // const errorMessage = (error as {response: {data: {message?: string}}})
      //   ?.response?.data?.message;
      // notify({
      //   type: 'error',
      //   message: errorMessage || 'درخواست شما قابل پردازش نیست',
      // });
    },
  });

  return {
    calcRefundHandler,
    calcRefundIsSuccess,
    calcRefundLoading,
    calcRefundData,
    calcRefundError,
  };
};

export default UseBusRefundCalculate;
