import { type ReactElement } from 'react';
import { TourLayout } from 'layout/tourLayout';
import { MobileLayout } from 'layout/mobileLayout';
import Footer from 'containers/landingPage/components/footer';
import { GetServerSideProps } from 'next';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import { fetchCmsVisaData } from 'utils/cms/services/api';
import { DataApiResponse } from 'utils/cms/services/type';
import { cmsFactory } from 'utils/cms/factory';
import useSeperateCmsComponent from 'utils/hooks/useSeperateCmsComponent';

const VisaLanding = ({ content }: { content: DataApiResponse }) => {
  const visaComponents = cmsFactory({ cmsData: content });
  const { SelectedComponent, displayedComponents } = useSeperateCmsComponent({
    components: visaComponents,
    value: 'blocks.visa-hero',
    webDisplayStart: 0,
    webDisplayLimit: 1,
  });
  return (
    <div dir="rtl">
      {SelectedComponent}
      <div className="container-lg">{displayedComponents}</div>
    </div>
  );
};
VisaLanding.getLayout = function getLayout(page: ReactElement) {
  const { breadCrumb, path, content } = page.props;
  return page.props.device == 'desktop' ? (
    <>
      <TourLayout>
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={content} path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </TourLayout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={content} path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </MobileLayout>
      <Footer />
    </>
  );
};

export default VisaLanding;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { resolvedUrl } = context;
  const pathname = resolvedUrl.substring(1);
  try {
    const fetchContent = await fetchCmsVisaData({
      path: pathname,
    });
    const { data: content } = fetchContent;
    return {
      props: {
        content: content,
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
