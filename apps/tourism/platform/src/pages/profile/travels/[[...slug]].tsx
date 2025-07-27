import type { ReactElement } from 'react';

import { Layout } from 'layout/desktopLayout';
import { ProfileLayout } from 'layout/desktopLayout/profile';
import { MobileLayout } from 'layout/mobileLayout';
import MyTravels from 'module/flights/travels';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginContainer from 'containers/login';

export default function Travels() {
  const { login } = useAuthContext();
  return login ? <MyTravels /> : <LoginContainer />;
}

Travels.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>
      <ProfileLayout>{page}</ProfileLayout>
    </Layout>
  ) : (
    <MobileLayout isProtected>{page}</MobileLayout>
  );
};
