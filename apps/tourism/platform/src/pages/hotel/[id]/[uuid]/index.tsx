import React, { ReactElement, useEffect } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import Footer from 'containers/landingPage/components/footer';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import HotelInfo from 'module/hotel/detail';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { Device } from 'utils/interface';
import * as Sentry from '@sentry/nextjs';
import { getHotelInfoServerSide } from 'services/hotel/hotelsAndCities';
import { THotelInfo } from 'services/hotel/hotelsAndCities/interface';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import { GetServerSideProps } from 'next';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';

interface Props {
  device: Device;
  detail: THotelInfo;
}
const HotelDetail = ({ device, detail }: Props) => {
  const { guestIsLoggedIn } = useGuestLogin();
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
  return guestIsLoggedIn && <HotelInfo detail={detail} device={device} />;
};

HotelDetail.getLayout = function getLayout(page: ReactElement) {
  const { device, path, breadCrumb } = page.props;

  return device == 'desktop' ? (
    <>
      <Layout {...page.props}>
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <MobileLayout {...page.props}>
      {page} <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
    </MobileLayout>
  );
};

export default HotelDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let detail: THotelInfo | null = null;
  try {
    const {
      query: { requestId, uuid },
    } = context;

    detail = await getHotelInfoServerSide(requestId as string, uuid as string);
  } catch (err) {
    Sentry.captureException(err);
  }
  return {
    props: {
      detail,
      ...serverSideBreadCrumbGenerator(context, detail?.details?.city?.name, detail?.details?.name),
    },
  };
};
