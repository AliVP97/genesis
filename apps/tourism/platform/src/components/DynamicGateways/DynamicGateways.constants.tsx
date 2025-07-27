import { Bank, CreditCard, WalletIcon } from 'assets/icons';
import { TGatewayPaymentMethod } from './DynamicGateways.types';

export const GATEWAYS_ICONS: Record<
  TGatewayPaymentMethod,
  {
    icon: JSX.Element;
  }
> = {
  ipg: {
    icon: <Bank />,
  },
  mpg: {
    icon: <CreditCard />,
  },
  wallet: {
    icon: <WalletIcon />,
  },
};
