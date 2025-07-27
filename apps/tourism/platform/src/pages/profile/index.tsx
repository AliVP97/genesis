import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { ProfileLayout } from 'layout/desktopLayout/profile';
import { MobileLayout } from 'layout/mobileLayout';
import React from 'react';
import Profile from 'module/general/profile';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginContainer from 'containers/login';

export default function ProfilePage() {
  const { login } = useAuthContext();
  return login ? <Profile /> : <LoginContainer />;
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>
      <ProfileLayout>{page}</ProfileLayout>
    </Layout>
  ) : (
    <MobileLayout isProtected>{page}</MobileLayout>
  );
};
