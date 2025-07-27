import type { ReactElement } from 'react';
import { TourLayout } from 'layout/tourLayout';
import { MobileLayout } from 'layout/mobileLayout';
import Footer from 'containers/landingPage/components/footer';
import VisaOrderContainer from 'module/visa/containers/visaOrder';
import { SeoMeta } from 'components/seoMeta';
import { TProps } from 'components/seoMeta/types';

export default function VisaOrder() {
  const metaData: TProps['metaData'] = {
    title: 'ویزا|هف‌هشتاد',
    description:
      'رزرو ویزا با هف‌هشتاد تجربه ای متفاوت. هف‌هشتاد با پشتیبانی 24 ساعته و بهترین قیمت',

    keywords: 'ویزا توریستی',
  };
  return (
    <>
      <SeoMeta metaData={metaData} />
      <VisaOrderContainer />
    </>
  );
}
VisaOrder.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <>
      <TourLayout>{page}</TourLayout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>{page}</MobileLayout>
      <Footer />
    </>
  );
};
