import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import { ReactElement, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeaderHoc from 'components/headerHoc';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { ServiceDetector } from 'utils/helpers/serviceDetector';

const PassengersList = dynamic(() => import('module/bus/passengers/list'), {
  ssr: false,
});

const PassengerPage = ({ isLogin }: { isLogin: boolean }) => {
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
      <PassengersList isLoggedIn={isLogin} singleSelect={false} />
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
