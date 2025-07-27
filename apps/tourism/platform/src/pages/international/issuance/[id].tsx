import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import FlightIssuance from 'module/internationalFlight/issuance';
// import {useEffect} from "react";

export default function index() {
  return <FlightIssuance />;
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
