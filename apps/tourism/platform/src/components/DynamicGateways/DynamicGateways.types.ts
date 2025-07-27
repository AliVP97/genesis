import { definitions } from 'types/payment';

export type TGatewayPaymentType = string | 'direct' | 'wallet';
export type TGatewayPaymentMethod = string | 'ipg' | 'mpg' | 'wallet';

export type TGateway = Omit<definitions['apipaymentGateway'], 'paymentType' | 'paymentMethod'> & {
  paymentType: TGatewayPaymentType;
  paymentMethod: TGatewayPaymentMethod;
};
