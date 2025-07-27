export type TSteps = 'reason' | 'ticket' | 'detail' | 'finalMessage';

export type TRefundReason = 'REFUNDREASON_BY_CRCN';

export enum BusRefundMessage {
  SUCCESS = 'استرداد شما با موفقیت انجام شد',
  ERROR = 'متاسفانه استرداد شما با خطا مواجه شد. کارشناسان ما بزودی با شما تماس خواهند گرفت',
}
