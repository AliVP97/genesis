import type { ReactElement } from 'react';
import PaymentResult from 'containers/payment';
import { BlankLayout } from 'layout/blankLayout';
import { useRouter } from 'next/router';
import TourPaymentResult from 'containers/payment/tourPayment';

export default function Payment() {
  const { query } = useRouter();
  return query?.serviceName === 'tour' ? <TourPaymentResult /> : <PaymentResult />;
}
Payment.getLayout = function getLayout(page: ReactElement) {
  const device = page.props.device;
  return device === 'desktop' ? <BlankLayout>{page}</BlankLayout> : <>{page}</>;
};
