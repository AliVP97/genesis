import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import TrainIssuance from 'module/train/issuance';
import { MobileLayout } from 'layout/mobileLayout';

export default function index() {
  return <TrainIssuance />;
}

index.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};
