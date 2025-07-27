import Footer from 'containers/landingPage/components/footer';
import React, { ReactElement, useEffect } from 'react';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import { DataApiResponse } from 'utils/cms/services/type';
import { cmsFactory } from 'utils/cms/factory';
import { fetchCmsData } from 'utils/cms/services/api';

type TParams = {
  params: { name: string };
};
export async function getStaticPaths() {
  return {
    paths: [
      { params: { name: 'mahan' } },
      { params: { name: 'sepehran' } },
      { params: { name: 'varesh' } },
      { params: { name: 'iranair' } },
      { params: { name: 'gheshmair' } },
      { params: { name: 'kishair' } },
      { params: { name: 'taban' } },
      { params: { name: 'zagros' } },
      { params: { name: 'iranairtour' } },
    ],
    fallback: true,
  };
}
export async function getStaticProps({ params }: TParams) {
  try {
    const url = `flights/airlines/${params.name}`;
    const fetchCms = await fetchCmsData({
      path: url,
    });

    return { props: { content: fetchCms?.data }, revalidate: 10 };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

function Airlines({ content }: { content: DataApiResponse }) {
  useEffect(() => {
    const wrapper = document?.querySelector('#home');
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return <>{cmsFactory({ cmsData: content })}</>;
}
Airlines.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  ) : (
    <MobileLayout {...page.props} backBtnLocation="/">
      {page}
    </MobileLayout>
  );
};

export default Airlines;
