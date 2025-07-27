import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
//import {TimeComparator} from 'utils/helpers/expireTimer';
import { ReactElement, useEffect } from 'react';
//import {useExpireContext} from 'utils/hooks/useExpireContext';
import dynamic from 'next/dynamic';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { TimeComparator } from 'utils/helpers/expireTimer';
// import {ServiceDetector} from 'utils/helpers/serviceDetector';
const InternationalFlightPassenger = dynamic(
  () => import('module/internationalFlight/passenger/list'),
  {
    ssr: false,
  },
);

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
        <span className="text-3 text-weight-500"> مسافران</span>
      </HeaderHoc>
      <InternationalFlightPassenger />
    </>
  );
};

PassengerPage.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <Layout isProtected {...page.props}>
      {page}
    </Layout>
  ) : (
    <MobileLayout isProtected {...page.props}>
      {page}
    </MobileLayout>
  );
};

export default PassengerPage;
