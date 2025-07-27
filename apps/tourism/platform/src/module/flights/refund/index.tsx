export type STEPS = 'selectPath' | 'selectReason' | 'selectTicket';
export type REFUND_REASONS =
  | 'REFUNDREASON_UNDEFINED'
  | 'REFUNDREASON_FLIGHT_CANCELED'
  | 'REFUNDREASON_BY_CRCN'
  | 'REFUNDREASON_FLIGHT_DELAYED';

export { RefundSelectPath } from './components/refundSelectPaths';
export { RefundSelectReason } from './components/refundSelectReasons';
export { RefundShowDetailsAndPassengers } from './components/refundShowDetailsAndPassengers';

export type OrderStatus =
  | 'ORDERSTATUS_UNDEFINED'
  | 'ORDERSTATUS_ORDER_CREATED'
  | 'ORDERSTATUS_ORDER_RESERVED'
  | 'ORDERSTATUS_CHECKED_OUT'
  | 'ORDERSTATUS_PAYMENT_FAILED'
  | 'ORDERSTATUS_PAYMENT_SUCCESS'
  | 'ORDERSTATUS_BUY_FAILED'
  | 'ORDERSTATUS_BUY_PENDING'
  | 'ORDERSTATUS_BUY_CONFIRMED'
  | 'ORDERSTATUS_CANCELED';

export const OrderStatusFa = {
  ORDERSTATUS_UNDEFINED: 'نامشخص',
  ORDERSTATUS_ORDER_CREATED: 'ثبت شده',
  ORDERSTATUS_ORDER_RESERVED: 'رزرو شده',
  ORDERSTATUS_CHECKED_OUT: 'چک اوت',
  ORDERSTATUS_PAYMENT_FAILED: 'پرداخت ناموفق',
  ORDERSTATUS_PAYMENT_SUCCESS: 'پرداخت موفق',
  ORDERSTATUS_BUY_FAILED: 'خرید ناموفق',
  ORDERSTATUS_BUY_PENDING: 'خرید موفق',
  ORDERSTATUS_BUY_CONFIRMED: 'تایید شده',
  ORDERSTATUS_CANCELED: 'لغو شده',
};

export const TicketStatusFa = {
  TICKETSTATUS_UNDEFINED: 'نامشخص',
  TICKETSTATUS_ISSUED: 'بلیط صادر شده',
  TICKETSTATUS_REFUND_REQUESTED: 'درخواست استرداد',
  TICKETSTATUS_REFUND_PROCESSING: 'در حال بررسی',
  TICKETSTATUS_REFUND_CONFIRMED: 'استرداد شده',
  TICKETSTATUS_REFUND_REJECTED: 'رد شده',
  TICKETSTATUS_REFUND_DONE: 'انجام شده',
  TICKETSTATUS_REFUND_FAILED: 'لغو شده',
};
