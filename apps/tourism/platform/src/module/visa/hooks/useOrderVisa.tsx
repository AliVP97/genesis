import { useMutation } from 'react-query';
import { notify } from 'utils/notification';
import { orderVisa } from 'services/visa';
import { TVisaAddToCartEvent } from 'utils/ecommerce/application/mappers/visa/types';
import { VisaTracking } from 'utils/ecommerce/application/mappers/visa/events';
import { useState } from 'react';

type TError = {
  response: {
    data: {
      errorCode: number;
      DTO: [{ messages: string[] }];
      service: {
        data: {
          message: string;
        };
      };
      status: number;
    };
  };
};

export const useOrderVisa = () => {
  const [orderVisaDataLoading, setOrderVisaDataLoading] = useState(false);
  const {
    data: orderVisaData,
    mutate: orderVisaMutate,
    status: orderVisaStatus,
  } = useMutation({
    mutationFn: orderVisa,
    onMutate: () => setOrderVisaDataLoading(true),
    onSuccess: (res) => {
      setOrderVisaDataLoading(false);
      const visaTracking = new VisaTracking();
      const visaTrackingModelConstructor = (): TVisaAddToCartEvent => {
        const adult = res?.service?.number_adults;
        const child = res?.service?.number_minors;
        const infant = res?.service?.number_babies;
        const begingCheckoutEvent: TVisaAddToCartEvent = {
          quantity: adult + child + infant,
          item_varient: res?.service?.visa_type,
          item_category2: res?.service?.renewal_visa,
          item_brand: res?.service?.visa_name,
          transactionID: res?.service?.rrn,
        };
        return begingCheckoutEvent;
      };
      visaTracking.purchase(visaTrackingModelConstructor());
      notify({
        type: 'success',
        message: 'درخواست شما با موفقیت ثبت شد.',
      });
    },
    onError: (error: TError) => {
      setOrderVisaDataLoading(false);
      error?.response?.data?.status === 406 &&
        notify({
          type: 'error',
          message: error?.response?.data?.service?.data?.message,
        });
      error.response.data.errorCode === 400 &&
        notify({
          type: 'error',
          message: error?.response?.data?.DTO[0]?.messages[0],
        });
    },
  });
  return {
    orderVisaData,
    orderVisaDataLoading,
    orderVisaMutate,
    orderVisaStatus,
  };
};
