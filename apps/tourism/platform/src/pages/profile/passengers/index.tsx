import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { ProfileLayout } from 'layout/desktopLayout/profile';
import { MobileLayout } from 'layout/mobileLayout';
// import MyTravels from 'module/flights/travels';

import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginContainer from 'containers/login';
import PassengersList from 'module/flights/travels/passengers';

export default function PassengersListPage() {
  const { login } = useAuthContext();

  return login ? <PassengersList /> : <LoginContainer />;
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
