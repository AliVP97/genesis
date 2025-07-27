import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import BusIssuance from 'module/bus/issuance';

export default function index() {
  return <BusIssuance />;
}

index.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};
