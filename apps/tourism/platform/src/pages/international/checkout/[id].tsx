import { ReactElement, useEffect } from 'react';
import { Layout } from 'layout/desktopLayout';
import Checkout from 'module/internationalFlight/checkout';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { TimeComparator } from 'utils/helpers/expireTimer';

const CheckoutPage = () => {
  const { checkExpiry } = useExpireContext();
  const service = ServiceDetector();

  useEffect(() => {
    const timeout = setTimeout(
      () => checkExpiry({ type: 'uuid', expired: true }),
      TimeComparator('uuid-expiry', service),
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <Checkout />;
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? <Layout>{page}</Layout> : <>{page}</>;
};

export default CheckoutPage;
