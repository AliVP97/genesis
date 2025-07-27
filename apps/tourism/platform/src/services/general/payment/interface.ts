import { definitions } from 'types/payment';
import { definitions as campaignDefinitions } from 'types/campaign';
import { Override } from 'utils/interface';

export type PaymentRequestHeader = {
  version: string;
  id: string;
};
export type OrderPayload = {
  payload: definitions['paymentOrderRequest'];
  reqHeader?: PaymentRequestHeader;
};

export type OrderResponse = definitions['paymentOrderResponse'];

type OrderDetail = definitions['paymentOrderStatusResponse'];

export type OrderDetailResponse = Override<
  OrderDetail,
  {
    data: {
      order_number?: string;
      rrn?: string;
      type: string;
      about?: string;
      reason?: string;
      fromFa?: string;
      toFa?: string;
      checkinDate?: string;
      checkoutDate?: string;
      tour_slug?: string;
      tour_id?: string;
      paymentType?: string;
      program_id?: string;
      total_passenger?: string;
      nightNo?: string;
      tour_type?: string;
      trip_type?: string;
      program_value?: string;
      program_title?: string;
    };
  }
>;

export type WalletOrderRes = definitions['paymentOrderWalletResponse'];
export type PaymentOrderResponse = definitions['paymentOrderResponse'];
export type ProductOrder = definitions['paymentOrderRequest'];
export type PaymentBanner = campaignDefinitions['campaignBannerResponseBanner'][];
