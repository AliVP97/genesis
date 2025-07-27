export type PaymentMethod = 'wallet' | 'petro' | 'ipg' | 'mpg';
export type PaymentType = 'direct' | 'wallet';
export type PaymentId = 1 | 5 | 2 | 3;
export type PaymentTypeName =
  | 'کیف پول'
  | 'پرداخت با کارت'
  | 'پرداخت با درگاه بانکی'
  | 'درگاه پرداخت پترو کارت';

export interface IPayment {
  id: PaymentId;
  name: PaymentTypeName;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
}

export const PaymentTypes: Array<IPayment> = [
  {
    id: 3,
    name: 'پرداخت با درگاه بانکی',
    paymentType: 'direct',
    paymentMethod: 'ipg',
  },
  {
    id: 5,
    name: 'درگاه پرداخت پترو کارت',
    paymentType: 'direct',
    paymentMethod: 'ipg',
  },
  {
    id: 2,
    name: 'پرداخت با کارت',
    paymentType: 'direct',
    paymentMethod: 'mpg',
  },
  {
    id: 1,
    name: 'کیف پول',
    paymentType: 'wallet',
    paymentMethod: 'wallet',
  },
];
