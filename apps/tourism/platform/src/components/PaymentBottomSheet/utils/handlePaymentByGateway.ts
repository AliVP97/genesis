import { payByIPG } from './payByIPG';
import { payByMPG } from './payByMPG';
import { payByWallet } from './payByWallet';

import { OrderResponse } from 'services/general/payment/interface';

import { TGateway } from 'components/DynamicGateways';

export type THandlePaymentByGatewayArgs = {
  orderId: string;
  orderJWT: string;
  selectedGateway: TGateway;
  isPartial?: boolean;
  paymentData?: OrderResponse;
};

export const handlePaymentByGateway = (props: THandlePaymentByGatewayArgs) => {
  if (props.selectedGateway.paymentMethod.toLowerCase() === 'ipg') {
    return payByIPG(props);
  } else if (props.selectedGateway.paymentMethod.toLowerCase() === 'mpg') {
    return payByMPG(props);
  } else if (props.selectedGateway.paymentType.toLowerCase() === 'wallet') {
    return payByWallet(props);
  }
};
