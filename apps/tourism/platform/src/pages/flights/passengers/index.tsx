import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { ReactElement, useEffect } from 'react';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import dynamic from 'next/dynamic';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
const PassengersList = dynamic(() => import('module/flights/passengers/list/index'), {
  ssr: false,
});

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
        <span className="text-3 text-weight-500"> مسافران </span>
      </HeaderHoc>
      <PassengersList />
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
