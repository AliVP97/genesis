import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { SitemapUrlGenerator } from 'utils/helpers/sitemapUrlGenerator';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const visaRoutes = [
    {
      path: 'dubai',
      lastMod: '2024-12-25T14:23:21+03:30',
    },
    {
      path: 'russia',
      lastMod: '2025-01-12T16:36:43+03:30',
    },
  ];

  const routes = visaRoutes?.map((item) => {
    return {
      urls: `visa/${item.path}`,
      lastMod: item.lastMod,
    };
  });

  const visaUrls = SitemapUrlGenerator(routes);

  return getServerSideSitemapLegacy(ctx, visaUrls);
};

export default function Sitemap() {
  // This page does not need to render anything.
}
