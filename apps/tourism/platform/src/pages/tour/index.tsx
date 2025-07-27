import React, { ReactElement } from 'react';

import Head from 'next/head';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import Footer from 'containers/landingPage/components/footer';
import { TTourLandingContent } from 'containers/landingPage/types';
import { checkBotAgent } from 'utils/helpers/checkBot';
import { getTourLandingContent } from 'services/tour/register';
import { LandingPage } from 'module/tour';
import TourPlpContainer from '../../module/tour/plp';

import { GetServerSideProps } from 'next';

import { serverSideBreadCrumbGenerator } from '../../utils/static/cms';
import MainBreadcrumb from '../../components/breadcrumb/mainBreadCrumb';


interface TProps {
  tourContent: TTourLandingContent;
  queryParams: { [key: string]: string | string[] };
}

export default function Tour({ tourContent, queryParams }: TProps): JSX.Element {
  const metaSeo = tourContent?.service?.data[0]?.attributes?.meta_seo;
  const title = tourContent?.service?.data[0]?.attributes?.title;
  const url = typeof window !== 'undefined' && window.location.href;

  const isSupperApp = useIsSuperApp();
  const shouldRenderTourPlp = queryParams && queryParams.type;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaSeo?.metaDescription} />
        <meta name="keywords" content={metaSeo?.keywords} />
        <meta property="og:url" content={url.toString()} />
      </Head>
      {!isSupperApp && (
        <>
          {shouldRenderTourPlp ? <TourPlpContainer /> : <LandingPage tourContent={tourContent} />}
        </>
      )}
    </>
  );
}
Tour.getLayout = function getLayout(page: ReactElement) {
  const { breadCrumb, path } = page.props;
  return page.props.device == 'desktop' ? (
    <>
      <Layout>
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>{page}</MobileLayout>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userAgent = context.req.headers['user-agent'] as string;
  const isBot = checkBotAgent(userAgent);
  const { query } = context;

  const isPWA = context.req.headers.host?.includes('pwa');
  const [content] = await Promise.all([getTourLandingContent()]);

  if (isPWA) {
    return {
      props: {
        isBot,
        tourProgram: null,
        tourContent: content,
        queryParams: query,
      },
    };
  }
  try {
    return {
      props: {
        tourContent: content,
        queryParams: query,
        ...serverSideBreadCrumbGenerator(context),
      },
    };
  } catch {
    return {
      props: {
        content: [],
        breadCrumb: [],
        path: '',
      },
    };
  }
};
