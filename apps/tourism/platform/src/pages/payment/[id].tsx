import type { ReactElement } from 'react';
import DesktopPayment from 'module/general/payment';

export default function DesktopPaymentPage() {
  return <DesktopPayment />;
}

DesktopPaymentPage.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
