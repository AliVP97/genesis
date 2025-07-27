import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { captureException } from '@sentry/nextjs';
import { urlMapper } from 'utils/helpers/urlMapper';
import { trainLines } from 'containers/landingPage/data';
import { SitemapUrlGenerator } from 'utils/helpers/sitemapUrlGenerator';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const trainCompaniesUrls = SitemapUrlGenerator(urlMapper(trainLines));

    const routes = trainCompaniesUrls;

    return await getServerSideSitemapLegacy(ctx, routes);
  } catch (error) {
    captureException(error);
    return { props: {} };
  }
};

export default function Sitemap() {
  // This page does not need to render anything.
}
