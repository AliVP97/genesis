import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import Receipt from 'module/general/receipt';

export default function ReceiptPage() {
  return <Receipt />;
}

ReceiptPage.getLayout = function getLayout(page: ReactElement) {
  const device = page.props.device;
  return device === 'desktop' ? <Layout>{page}</Layout> : <>{page}</>;
};
