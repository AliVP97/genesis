import Footer from 'containers/landingPage/components/footer';
import { Layout } from 'layout/desktopLayout';
import React, { ReactElement, useEffect } from 'react';
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
      { params: { name: 'raja' } },
      { params: { name: 'nooralreza' } },
      { params: { name: 'fadak' } },
      { params: { name: 'joupar' } },
      { params: { name: 'bonrail' } },
      { params: { name: 'railtarabarsaba' } },
      { params: { name: 'railseirkosar' } },
      { params: { name: 'mahtabseirjam' } },
      { params: { name: 'hastia' } },
      { params: { name: 'parslarim' } },
      { params: { name: 'raadtabriz' } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }: TParams) {
  try {
    const url = `train/companies/${params.name}`;
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

function Companies({ content }: { content: DataApiResponse }) {
  useEffect(() => {
    const wrapper = document?.querySelector('#home');
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return <>{cmsFactory({ cmsData: content })}</>;
}

Companies.getLayout = function getLayout(page: ReactElement) {
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

export default Companies;
