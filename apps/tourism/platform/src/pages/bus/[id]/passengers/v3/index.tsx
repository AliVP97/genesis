import { ReactElement, useEffect } from 'react';

import HeaderHoc from 'components/headerHoc';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import Passengers from 'module/bus/passengers';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useExpireContext } from 'utils/hooks/useExpireContext';

const PassengerPage = () => {
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

  return (
    <>
      <HeaderHoc>
        <span className="text-3 text-weight-500">انتخاب مسافران</span>
      </HeaderHoc>
      <Passengers />
    </>
  );
};

PassengerPage.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <Layout {...page.props}>{page}</Layout>
  ) : (
    <MobileLayout {...page.props}>{page}</MobileLayout>
  );
};

export default PassengerPage;
