import { useRouter } from 'next/router';
import { MetaTag, TProps } from '../type';

const robotsContentGeneartor = (index?: boolean, follow?: boolean) => {
  const contents = [index ? 'index' : 'noindex', follow ? 'follow' : 'nofollow'];
  return contents.join(',');
};

export const useLogicHeader = ({ metaData }: TProps) => {
  const { title, description, keywords, canonicalUrl, index, follow, metaOgSocial, twitter } =
    metaData ?? {};

  const { pathname } = useRouter();

  const pathImage = (imageUrl: string | undefined) => {
    const cleanUrl = imageUrl?.replace(/^\//, '');
    if (imageUrl) {
      return cleanUrl;
    } else {
      return;
    }
  };

  const canonicalPath = canonicalUrl ?? `${process.env.NEXT_PUBLIC_DOMAIN_URL}${pathname}`;

  const robotsContent = robotsContentGeneartor(index, follow);

  const metaTags: MetaTag[] = [
    { key: 'title', tag: 'title', attributes: { children: title } },
    {
      key: 'description',
      tag: 'meta',
      attributes: { name: 'description', content: description },
    },
    {
      key: 'keywords',
      tag: 'meta',
      attributes: { name: 'keywords', content: keywords },
    },
    {
      key: 'canonical',
      tag: 'link',
      attributes: { rel: 'canonical', href: canonicalPath },
    },
    {
      key: 'robots',
      tag: 'meta',
      attributes: { name: 'robots', content: robotsContent },
    },
    {
      key: 'googlebot',
      tag: 'meta',
      attributes: { name: 'googlebot', content: robotsContent },
    },
    {
      key: 'og:title',
      tag: 'meta',
      attributes: {
        property: 'og:title',
        content: metaOgSocial?.title,
      },
    },
    {
      key: 'og:description',
      tag: 'meta',
      attributes: {
        property: 'og:description',
        content: metaOgSocial?.description,
      },
    },
    {
      key: 'og:url',
      tag: 'meta',
      attributes: {
        property: 'og:url',
        content: metaOgSocial?.url,
      },
    },
    {
      key: 'og:image',
      tag: 'meta',
      attributes: {
        property: 'og:image',
        content: pathImage(metaOgSocial?.image?.url),
      },
    },
    {
      key: 'og:type',
      tag: 'meta',
      attributes: {
        property: 'og:type',
        content: metaOgSocial?.type,
      },
    },
    {
      key: 'twitter:title',
      tag: 'meta',
      attributes: {
        property: 'twitter:title',
        content: twitter?.title,
      },
    },
    {
      key: 'twitter:description',
      tag: 'meta',
      attributes: {
        property: 'twitter:description',
        content: twitter?.description,
      },
    },
    {
      key: 'twitter:image',
      tag: 'meta',
      attributes: {
        property: 'twitter:image',
        content: pathImage(twitter?.image?.url),
      },
    },
    {
      key: 'twitter:url',
      tag: 'meta',
      attributes: {
        property: 'twitter:url',
        content: twitter?.url,
      },
    },
    {
      key: 'twitter:card',
      tag: 'meta',
      attributes: {
        property: 'twitter:card',
        content: twitter?.card,
      },
    },
  ];

  const validateMetaTagAttributes = (props: MetaTag): boolean => {
    switch (props.tag) {
      case 'title':
        return Boolean(props.attributes.children);
      case 'link':
        return Boolean(props.attributes.href);
      case 'meta':
        return Boolean(props.attributes.content);
      default:
        return false;
    }
  };

  const filteredMetaTags = metaTags.filter(validateMetaTagAttributes);

  return {
    filteredMetaTags,
  };
};
