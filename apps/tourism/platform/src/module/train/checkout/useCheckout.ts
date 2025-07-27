import { useState } from 'react';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

import { contactInfo } from 'services/train/contact';
import { getOrder, reserveOrder, TReserveBody } from 'services/train/orders';
import { useResponsive } from 'utils/hooks/useResponsive';
import { TGateway } from 'components/DynamicGateways';
import { captchaImageQuery } from 'services/train/captcha';
import { phoneNumberFromJWT } from './helper';
import { useHandlePayment } from './hooks/useHandlePayment';

export type TCheckoutFormValues = {
  phoneNumber: string;
  email: string;
  captchaId: TReserveBody['captchaId'];
  captchaText: TReserveBody['captchaText'];
};

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const { query, back } = useRouter();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [gateway, setGateway] = useState<TGateway>();

  const formHook = useForm<TCheckoutFormValues>({
    defaultValues: {
      phoneNumber: (query?.phoneNumber as string) || phoneNumberFromJWT(),
      email: query?.email as string,
    },
    mode: 'onChange',
  });

  const { isMobile } = useResponsive();
  const { data: orderData } = useQuery(['order', query.id as string], getOrder);

  const onCreate = async (orderId?: string) => {
    if (!orderId) return;

    const contactInfoHasChanged =
      formHook.formState.touchedFields?.phoneNumber || formHook.formState.touchedFields.email;

    if (contactInfoHasChanged) {
      const { phoneNumber, email } = formHook.getValues();

      await contactInfo({
        phoneNumber,
        email,
        orderId,
      });
    }

    const { captchaId, captchaText } = formHook.getValues();

    const { paymentId } = await reserveOrder({
      orderId,
      captchaId,
      captchaText,
    });

    return paymentId;
  };

  const onSuccess = () => {
    queryClient.invalidateQueries(['order', query.id as string]);
  };

  const onError = () => {
    queryClient.invalidateQueries(captchaImageQuery(query.id as string));
  };

  const { submitMutate, isLoading, loading, setLoading } = useHandlePayment(
    gateway,
    onCreate,
    onSuccess,
    onError,
  );

  const onSubmit = () => {
    setLoading(true);

    return isMobile ? setIsBottomSheetOpen(true) : submitMutate();
  };

  const onDismiss = () => {
    setLoading(false);

    setIsBottomSheetOpen(false);
  };

  return {
    orderData,
    back,
    isLoading: loading || isLoading,
    isBottomSheetOpen,
    onSubmit,
    onDismiss,
    onCreate,
    onSuccess,
    onError,
    setGateway,
    isMobile,
    formHook,
  };
};
