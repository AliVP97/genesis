import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import React from 'react';
import MyTravels from 'module/flights/travels';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginContainer from 'containers/login';

export default function Travels() {
  const { login } = useAuthContext();

  return login ? <MyTravels /> : <LoginContainer />;
}

Travels.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout isProtected>{page}</Layout>
  ) : (
    <MobileLayout isProtected>{page}</MobileLayout>
  );
};
