import { RefundContainer } from 'containers/refund';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import React, { ReactElement } from 'react';
import HeaderHoc from 'components/headerHoc';

const RefundPage = () => {
  return (
    <>
      <HeaderHoc>
        <p className="text-center">استرداد</p>
      </HeaderHoc>
      <RefundContainer />
    </>
  );
};

RefundPage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};

export default RefundPage;
