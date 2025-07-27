import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import { ProfileLayout } from 'layout/desktopLayout/profile';
import { MobileLayout } from 'layout/mobileLayout';
import Support from 'module/general/support';
import React from 'react';
import { fetchSupportCmsData } from 'utils/cms/services/api';
import { GetServerSideProps } from 'next';
import { SupportPageProps } from 'pages/support';

export default function SupportPage({ content }: SupportPageProps) {
  return <Support content={content} />;
}
SupportPage.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>
      <ProfileLayout>{page}</ProfileLayout>
    </Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const pathname = 'profile/support';
  try {
    const fetchContent = await fetchSupportCmsData({
      path: pathname,
    });
    const { data: content } = fetchContent;
    return {
      props: {
        content: content,
      },
    };
  } catch {
    return {
      props: {
        content: null,
      },
    };
  }
};
