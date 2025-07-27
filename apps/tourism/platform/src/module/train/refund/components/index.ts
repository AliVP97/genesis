import { Dispatch } from 'react';

export * from './Footer';
export * from './Header';
export * from './Loader';
export * from './PaymentDetails';
export * from './RefundDetails';
export * from './RefundResult';
export * from './SelectTrainId';

export type TComponentProps = {
  setAllowSubmit: Dispatch<React.SetStateAction<boolean>>;
};
