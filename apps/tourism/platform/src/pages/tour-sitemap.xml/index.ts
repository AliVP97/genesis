import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { captureException } from '@sentry/nextjs';
import { getTourLandingPrograms } from 'services/tour/register';
import { TTourContent } from 'containers/landingPage/types';
import { SitemapUrlGenerator } from 'utils/helpers/sitemapUrlGenerator';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const tourData: { service: { data: { tour: [TTourContent] } } } =
      await getTourLandingPrograms();

    const items = tourData?.service?.data?.tour?.map((item) => {
      return {
        urls: `tour/${item?.attributes?.type}/${item?.attributes?.slug}`,
        lastMod: item?.attributes?.updatedAt,
      };
    });

    const tourUrls = SitemapUrlGenerator(items);

    return await getServerSideSitemapLegacy(ctx, tourUrls);
  } catch (error) {
    captureException(error);
    return { props: {} };
  }
};

export default function Sitemap() {
  // This page does not need to render anything.
}
