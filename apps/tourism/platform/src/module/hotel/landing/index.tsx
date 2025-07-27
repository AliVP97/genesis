import { HotelApp } from 'assets/images';
import Download from 'containers/landingPage/components/download';
import FAQ from 'containers/landingPage/components/faq';
import Services from 'containers/landingPage/components/services';
import { HotelTabbedArticle, hotelFaqs, hotelMagazine } from 'containers/landingPage/data';
import { TabbedArticle } from 'containers/landingPage/components/tabbedArticle';
import { SeoMeta } from 'components/seoMeta';
import CompanyAdvice from '../../../containers/landingPage/components/companyAdvice';
import HotelDescription from './description';
import HotelFullDescription from './fullDescription';
import { LandingPageType } from 'pages/bus';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { useMemo } from 'react';
import Magazine from 'containers/landingPage/components/magazine';

function HotelLandingPage({ content }: LandingPageType) {
  const faqData = content?.faq;
  const seoData = content?.meta_seo;

  const metaData = useMemo(() => {
    const { metaData } = mapSeoData(seoData);
    return metaData;
  }, [seoData]);

  return (
    <>
      <SeoMeta metaData={metaData} />
      <div className="rtl">
        <div className="my-4">
          <Services />
        </div>
        <div className="my-4">
          <TabbedArticle data={content} staticData={HotelTabbedArticle} />
        </div>
        <br />
        <div className="my-4">
          <CompanyAdvice
            description={<HotelDescription />}
            fullDescription={<HotelFullDescription />}
          />
        </div>
        <br />
        <div className="my-4">
          <Download image={HotelApp} />
        </div>
        <div className="my-4">
          <Magazine magazines={hotelMagazine} />
        </div>
        <br />
        <div className="my-4">
          <FAQ faqs={faqData} staticData={hotelFaqs} />
        </div>
        <br />
      </div>
    </>
  );
}

export default HotelLandingPage;
