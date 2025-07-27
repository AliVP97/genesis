import { useState } from 'react';

import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

import { TGateway } from 'components/DynamicGateways';
import { handlePaymentByGateway } from 'components/PaymentBottomSheet/utils';
import { TErrorResponse } from 'services/bus';
import { RootState } from 'store';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { notify } from 'utils/notification';

export const useHandlePayment = (
  selectedGateway: TGateway | undefined,
  onCreateInvoice: (orderId?: string) => Promise<string | undefined>,
  onSuccessInvoice: () => void,
  onError: () => void,
) => {
  const [loading, setLoading] = useState(false);

  const { trainData, trainPassengersLength } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );

  const { query } = useRouter();

  const handlePaymentButton = async () => {
    const paymentId = await onCreateInvoice(query.id as string);

    if (paymentId && selectedGateway) {
      await handlePaymentByGateway({
        orderId: query.id as string,
        orderJWT: paymentId,
        selectedGateway,
      });

      if (trainData) {
        const trainEvent = new TrainTrackingEvent();
        trainEvent.addPaymentInfo(
          trainData as trainViewListItemModel,
          selectedGateway.paymentMethod,
          trainPassengersLength as number,
        );
      }
    }
  };

  const { mutate: submitMutate, isLoading } = useMutation({
    mutationFn: handlePaymentButton,
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: onSuccessInvoice,
    onError: (err: AxiosError<TErrorResponse>) => {
      setLoading(false);
      notify({ type: 'error', message: err.response?.data.message });
      onError();
    },
  });

  return {
    submitMutate,
    isLoading,
    setLoading,
    loading,
  };
};
