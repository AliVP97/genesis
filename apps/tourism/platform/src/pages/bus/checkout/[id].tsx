import { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import Checkout from 'module/bus/checkout';

const CheckoutPage = () => {
  return <Checkout />;
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? <Layout>{page}</Layout> : <>{page}</>;
};

export default CheckoutPage;
