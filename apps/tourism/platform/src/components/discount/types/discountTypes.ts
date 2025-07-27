import { ReactNode } from 'react';
export type UseDiscountReturnType = {
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearHandler: () => void;
  clearMessageHandler: () => void;
  disableHandler: (e: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
  message: string;
  isDisabledBtn: boolean;
  status: DiscountStatus;
};

export type DiscountStatus = 'removed' | 'applied' | 'idle' | 'error';

export type TDiscountOrder = {
  orderId?: string;
  discount?: {
    code?: string;
    amount?: string | number;
    hasError?: boolean;
    message?: string;
  };
  url: string;
};

export type TDiscountProps = {
  hasActionOnPrice?: boolean;
  formAlert?: ReactNode;
  discountOrder?: TDiscountOrder;
} & UseDiscountReturnType;

export type ApplyDiscountResponse = {
  applied?: boolean;
  reason?: string;
  discountCode?: string;
  payAmount?: string;
};
export type RemoveDiscountResponse = {
  removed?: boolean;
  reason?: string;
  payAmount?: string;
};
