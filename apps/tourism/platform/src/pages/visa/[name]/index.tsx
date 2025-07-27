import React, { ReactElement } from 'react';
import { TourLayout } from 'layout/tourLayout';
import Footer from 'containers/landingPage/components/footer';
import { MobileLayout } from 'layout/mobileLayout';
import { checkBotAgent } from 'utils/helpers/checkBot';
import { GetServerSideProps } from 'next';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import { cmsFactory } from 'utils/cms/factory';
import { DataApiResponse } from 'utils/cms/services/type';
import { fetchCmsVisaData } from 'utils/cms/services/api';
import VisaOrderSection from 'module/visa/components/visaOrderSection';
import useSeperateCmsComponent from 'utils/hooks/useSeperateCmsComponent';

const Visa = ({ content }: { content: DataApiResponse }) => {
  const visaComponents = cmsFactory({ cmsData: content });
  const { SelectedComponent, displayedComponents } = useSeperateCmsComponent({
    components: visaComponents,
    value: 'blocks.visa-page-hero',
    webDisplayStart: 0,
    webDisplayLimit: 2,
  });

  return (
    <div dir="rtl">
      {SelectedComponent}
      <div className="container-lg">
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-md-12 col-lg-9">{displayedComponents}</div>
          <div className="col">
            <VisaOrderSection />
          </div>
        </div>
      </div>
    </div>
  );
};

Visa.getLayout = function getLayout(page: ReactElement) {
  const { device, path, breadCrumb, visaContent } = page.props;

  return device == 'desktop' ? (
    <>
      <TourLayout>
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={visaContent} path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </TourLayout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={visaContent} path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </MobileLayout>{' '}
      <div className="clearfix"></div>
      <Footer />
    </>
  );
};
export default Visa;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query, resolvedUrl } = context;
  const userAgent = req.headers['user-agent'] as string;
  const isBot = checkBotAgent(userAgent);
  const visa = query.name as string;
  const pathname = resolvedUrl.substring(1);
  if (!isBot) {
    if (!['dubai', 'russia'].includes(visa)) {
      return {
        notFound: true,
      };
    }
  }
  try {
    const fetchContent = await fetchCmsVisaData({
      path: pathname,
    });
    const { data: content } = fetchContent;
    if (Object.keys(content).length === 0) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        content,
        ...serverSideBreadCrumbGenerator(context),
      },
    };
  } catch {
    return {
      props: {
        content: null,
        breadCrumb: [],
        path: '',
      },
    };
  }
};
