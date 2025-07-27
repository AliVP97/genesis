import { BottomSheetProps } from 'react-spring-bottom-sheet';
import { definitions } from 'types/payment';

export type TPaymentBottomSheet = {
  paymentHookOptions: TUsePaymentOptions;
  onGatewayChange?: (gatewayId: number) => void;
  noticeModalText?: string;
} & Omit<BottomSheetProps, 'children'>;

export type TUsePaymentOptions = {
  onCreate: (orderId?: string) => string | Promise<string | undefined>;
  onSuccess?: (data: definitions['paymentInvoiceResponse']) => void;
  onError?: (error: unknown) => void;
  onConfirm?: (gateway?: definitions['apipaymentGateway']) => void | Promise<unknown>;
  onInvalidate?: () => void;
};

export type TInvoiceResponse = definitions['paymentInvoiceResponse'];

export type TLazyState = {
  selectedGatewayId?: number;
  orderJWT?: string;
};
