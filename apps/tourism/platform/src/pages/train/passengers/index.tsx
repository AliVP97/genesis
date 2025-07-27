import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
import { ReactElement, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
const PassengersList = dynamic(() => import('module/train/passengers/list'), {
  ssr: false,
});

const PassengerPage = () => {
  const { checkExpiry } = useExpireContext();
  const service = ServiceDetector();
  const { trainData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  useEffect(() => {
    const timeout = setTimeout(
      () => checkExpiry({ type: 'uuid', expired: true }),
      TimeComparator('uuid-expiry', service),
    );
    if (trainData) {
      const trainEvent = new TrainTrackingEvent();
      trainEvent.beginCheckout(trainData as trainViewListItemModel);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      <HeaderHoc>
        <span className="text-3 text-weight-500">افزودن مسافر</span>
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
