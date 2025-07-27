import { UseDiscountReturnType } from 'components/discount/types/discountTypes';
import { definitions } from 'types/hotel';

export interface CheckoutFormProps {
  OffCode: string;
}

export type TPaymentOrder = definitions['apihotelPayment'];

export type TFactorProps = {
  paymentOrder?: TPaymentOrder;
} & UseDiscountReturnType;
