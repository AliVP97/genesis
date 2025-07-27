import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
import { ReactElement } from 'react';
import { HotelAddLeaders } from 'module/hotel/addLeaders';
import { Device } from 'utils/interface';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useEffect } from 'react';

interface Props {
  device: Device;
}
const SeatSelectionPage = ({ device }: Props) => {
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
        <span className="text-3 text-weight-500">انتخاب سرپرست مسافران</span>
      </HeaderHoc>
      <HotelAddLeaders device={device} />
    </>
  );
};

SeatSelectionPage.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <Layout {...page.props}>{page}</Layout>
  ) : (
    <MobileLayout {...page.props}>{page}</MobileLayout>
  );
};

export default SeatSelectionPage;
