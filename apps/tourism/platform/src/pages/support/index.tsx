import type { ReactElement } from 'react';
import { Layout } from 'layout/desktopLayout';
import Support from 'module/general/support';
import { MobileLayout } from 'layout/mobileLayout';
import { fetchSupportCmsData } from 'utils/cms/services/api';
import { GetServerSideProps } from 'next';
import { DataApiResponse } from 'utils/cms/services/type';

export type SupportPageProps = {
  content: DataApiResponse;
};

export default function support({ content }: SupportPageProps) {
  return <Support content={content} />;
}
support.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <Layout>{page}</Layout>
  ) : (
    <MobileLayout>{page}</MobileLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const pathname = 'support';
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
