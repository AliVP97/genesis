import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HotelIssuance from 'module/hotel/issuance';
// import {useEffect} from "react";

export default function index() {
  return <HotelIssuance />;
}

// useEffect(()=>{
//   localStorage.removeItem('uuid-expiry');
// },[])

index.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};
