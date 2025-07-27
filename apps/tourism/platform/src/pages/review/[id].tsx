import React, { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import ReviewTicket from 'module/flights/review';

const Review = () => {
  return <ReviewTicket />;
};
Review.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout backBtnLocation="/">{page}</MobileLayout>
  );
};
export default Review;
