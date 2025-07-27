import { TFlightContents } from 'services/domestic/flight/interface';

export const mapSeoData = (seoData: TFlightContents['data'][number]['attributes']['meta_seo']) => {
  const metaData = {
    title: seoData?.metaTitle,
    description: seoData?.metaDescription,
    keywords: seoData?.keywords,
    canonical: seoData?.canonicalURL,
    follow: seoData?.follow,
    index: seoData?.index,
    ogMeta: seoData?.metaOgSocial,
    socialNetworkMeta: seoData?.twitter,
  };
  return {
    metaData,
  };
};
