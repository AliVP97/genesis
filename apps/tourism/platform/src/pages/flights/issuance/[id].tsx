import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import FlightIssuance from 'module/flights/issuance';
import { MobileLayout } from 'layout/mobileLayout';

export default function index() {
  return <FlightIssuance />;
}

index.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};
