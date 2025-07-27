import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { DiscountStatus, TDiscountOrder } from '../types/discountTypes';
import { applyDiscountOnOrder, removeDiscountFromOrder } from 'services/discount';

export const useDiscount = (
  discountOrder: TDiscountOrder,
  refetchOrder?: () => void,
  changePriceActionsToDisabled?: (isDisabled: boolean) => void,
) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<DiscountStatus>('idle');

  useEffect(() => {
    if (changePriceActionsToDisabled !== undefined) {
      if (isLoading) {
        changePriceActionsToDisabled(true);
      } else {
        changePriceActionsToDisabled(false);
      }
    }
  }, [isLoading]);

  const applyDiscount = async (discountCode: string) => {
    if (!discountOrder?.orderId) {
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await applyDiscountOnOrder(discountOrder.url, discountCode);

      setIsLoading(false);
      refetchOrder?.();

      if (res?.applied) {
        setStatus('applied');
      } else {
        setStatus('error');
      }

      if (res?.reason) setMessage(res.reason);
    } catch (error) {
      setIsLoading(false);
      setStatus('error');

      if (error instanceof AxiosError) {
        setMessage(error.message);
      }
    }
  };

  const removeDiscount = async () => {
    if (!discountOrder?.orderId || !discountOrder?.discount?.code) {
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    const res = await removeDiscountFromOrder(discountOrder.url);

    setIsLoading(false);

    if (res?.removed) {
      refetchOrder?.();
      setStatus('removed');
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    if (status === 'applied') {
      removeDiscount();
    } else if (status === 'idle') {
      applyDiscount(result.discountCode as string);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setStatus('idle');
    setValue(e.target.value);
  };

  const clearHandler = () => {
    setMessage('');
    setStatus('idle');
    setValue('');
  };

  const clearMessageHandler = () => {
    setMessage('');
  };

  useEffect(() => {
    if (discountOrder?.discount?.code) {
      const discount = discountOrder.discount;
      setValue(discount.code || '');

      if (discount?.message) {
        setMessage(discount.message);
      }
      if (discount?.hasError) {
        setStatus('error');
      } else {
        setStatus('applied');
      }
    } else {
      clearHandler();
    }
  }, [discountOrder?.discount?.code]);

  const isDisabledBtn = isLoading || status === 'removed' || value.length < 3;

  const disableHandler = (isDisable: boolean) => {
    setStatus('removed');
    setIsDisabled(isDisable);
    refetchOrder?.();
    setValue('');
  };

  return {
    submitHandler,
    changeHandler,
    clearHandler,
    disableHandler,
    clearMessageHandler,
    isDisabled,
    isLoading,
    message,
    status,
    isDisabledBtn,
  };
};
