export const SitemapUrlGenerator = (items: { urls: string; lastMod?: string }[]) => {
  const formatDate = (date: string) => date.slice(0, 19) + '+03:30';
  return items.map((item) => ({
    loc: `${process.env.NEXT_PUBLIC_SITE_URL}/${item.urls}`,
    lastmod: item.lastMod ? formatDate(item.lastMod) : new Date().toISOString(),
  }));
};
