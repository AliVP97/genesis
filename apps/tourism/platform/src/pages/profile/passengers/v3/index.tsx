import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { ProfileLayout } from 'layout/desktopLayout/profile';
import { MobileLayout } from 'layout/mobileLayout';
// import MyTravels from 'module/flights/travels';
import cn from 'classnames';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginContainer from 'containers/login';

import PassengerList from 'components/passenger/components/passengersList';

export default function PassengersListPage({ device }: { device: string }) {
  const { login } = useAuthContext();

  return login ? (
    <div className={cn(device === 'desktop' ? 'px-4 mb-5' : '')}>
      {' '}
      <PassengerList serviceName="passenger" />
    </div>
  ) : (
    <LoginContainer />
  );
}

PassengersListPage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>
      <ProfileLayout>{page}</ProfileLayout>
    </Layout>
  ) : (
    <MobileLayout isProtected>{page}</MobileLayout>
  );
};
