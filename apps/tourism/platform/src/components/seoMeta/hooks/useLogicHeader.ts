import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

import { stationQuery as busStationQuery } from 'services/bus/stations';
import { TBusStations } from 'services/bus/stations/interface';
import { stationQuery as trainStationQuery } from 'services/train/stations';
import { TTrainStations } from 'services/train/stations/interface';
import { iataToFarsi } from 'utils/static/flightStatics';
import { iataToFarsiCity } from 'utils/static/internationalFlight';
import { staticMetaData } from '../helpers/staticMetaData';
import { MetaTag, TProps, TServices } from '../types';

const serviceName: TServices = {
  flights: 'هواپیما',
  train: 'قطار',
  bus: 'اتوبوس',
  international: 'هواپیما',
};
const excludedPaths: string[] = [
  'passengers',
  'hotel',
  'receipt',
  'review',
  'travels',
  'buyProcess',
  'checkout',
  'seatSelection',
  'tour',
];

const baseURL = process.env.NEXT_PUBLIC_DOMAIN;

const translateCanonicals = (
  routeName: string,
  originId: string,
  destinationId: string,
): Record<string, () => string> => ({
  flights: () => `${baseURL}tourism/${routeName}/${originId}-${destinationId}`,
  train: () => `${baseURL}tourism/${routeName}/${originId}-${destinationId}`,
  bus: () => {
    const translatedOrigin = originId.match(/\D+/)?.[0];
    const translatedDestination = destinationId?.match(/\D+/)?.[0];

    return `${baseURL}tourism/${routeName}/${translatedOrigin || originId}-${
      translatedDestination || destinationId
    }`;
  },
  international: () => `${baseURL}tourism/${routeName}/${originId}-${destinationId}`,
});

const robotsContentGeneartor = (index?: boolean, follow?: boolean) => {
  const contents = [index ? 'index' : 'noindex', follow ? 'follow' : 'nofollow'];
  return contents.join(',');
};

export const useLogicHeader = ({ metaData }: TProps) => {
  const { title, description, keywords, canonical, index, follow, ogMeta, socialNetworkMeta } =
    metaData ?? {};
  const queryClient = useQueryClient();
  const { query, pathname } = useRouter();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const routeName = pathname.split('/', 2)[1];
  const serviceNameFa = serviceName[routeName];
  const originId = (query.id as string)?.split('-')[0];
  const destinationId = (query.id as string)?.split('-')[1];
  const isDynamicPath =
    !pathname.includes('payment') &&
    pathname.includes('[id]') &&
    !excludedPaths.some((excludedPath) => pathname.includes(excludedPath));
  const isDynamicNamePath = pathname.includes('[name]');
  const translationFunctions: Record<string, (id: string) => string> = {
    flights: (id) => iataToFarsi[id],
    train: (id) =>
      queryClient.getQueryData<TTrainStations>(trainStationQuery(id).queryKey)?.stations?.[0]
        ?.farsiName || '',
    bus: (id) =>
      queryClient.getQueryData<TBusStations>(busStationQuery(id).queryKey)?.stations?.[0]
        ?.cityName || '',
    international: (id) => iataToFarsiCity[id],
  };
  const translationFunction = translationFunctions[routeName];
  const translateCanonical = translateCanonicals(routeName, originId, destinationId)[routeName];

  const originNameFa = translationFunction ? translationFunction(originId) : '';

  const destinationNameFa = translationFunction ? translationFunction(destinationId) : '';

  const staticDynamicPathKeywords = `بلیط ${serviceNameFa} ${originNameFa} ${destinationNameFa}`;
  const staticPathKeywords = 'keywords';

  const pathCanonical: string = (() => {
    if (isDynamicPath) {
      return translateCanonical();
    } else if (isDynamicNamePath) {
      return url;
    } else {
      return `${baseURL}tourism/${routeName}`;
    }
  })();

  const serviceStaticData = staticMetaData({
    serviceName: routeName,
    origin: originNameFa,
    destination: destinationNameFa,
  });

  const staticPathTitle = 'خرید انواع بلیط هواپیما، قطار و اتوبوس از هف‌هشتاد';

  const staticPathDescription =
    'برای خرید انواع بلیط هواپیما، قطار و اتوبوس ،ابتدا به سایت یا اپلیکیشن هف‌هشتاد مراجعه کنید و بلیط مورد نظر خود را جستجو و با ارزانترین قیمت آن را خریداری کنید.';

  const pathTitle = (newTitle: string | undefined) => {
    if (newTitle) {
      return newTitle;
    } else if (isDynamicPath) {
      return serviceStaticData.title;
    } else {
      return staticPathTitle;
    }
  };

  const pathDescription = (newDescription: string | undefined) => {
    if (newDescription) {
      return newDescription;
    } else if (isDynamicPath) {
      return serviceStaticData.description;
    } else {
      return staticPathDescription;
    }
  };

  const pathKeywords: string = (() => {
    if (keywords) {
      return keywords;
    } else if (isDynamicNamePath) {
      return staticDynamicPathKeywords;
    } else {
      return staticPathKeywords;
    }
  })();

  const canonicalWithoutEndingSlash: string = (() => {
    if (canonical) {
      return canonical;
    } else if (pathCanonical.endsWith('tourism/')) {
      return pathCanonical.substring(0, pathCanonical.length - 1);
    } else {
      return pathCanonical;
    }
  })();

  const pathUrl = (newUrl: string | undefined) => {
    if (newUrl) {
      return newUrl;
    }
    if (isDynamicPath) {
      return `${baseURL}tourism/${routeName}/${originId}-${destinationId}`;
    } else if (isDynamicNamePath) {
      return newUrl;
    } else {
      return `${baseURL}tourism/${routeName}`;
    }
  };

  const pathImage = (imageUrl: string | undefined) => {
    const cleanUrl = imageUrl?.replace(/^\//, '');
    if (imageUrl) {
      return `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${cleanUrl}`;
    } else {
      return;
    }
  };

  const robotsContent = robotsContentGeneartor(index, follow);

  const metaTags: MetaTag[] = [
    { key: 'title', tag: 'title', attributes: { children: pathTitle(title) } },
    {
      key: 'description',
      tag: 'meta',
      attributes: { name: 'description', content: pathDescription(description) },
    },
    {
      key: 'keywords',
      tag: 'meta',
      attributes: { name: 'keywords', content: pathKeywords },
    },
    {
      key: 'canonical',
      tag: 'link',
      attributes: { rel: 'canonical', href: canonicalWithoutEndingSlash },
    },
    {
      key: 'robots',
      tag: 'meta',
      attributes: { name: 'robots', content: robotsContent },
    },
    {
      key: 'og:title',
      tag: 'meta',
      attributes: {
        property: 'og:title',
        content: pathTitle(ogMeta?.title),
      },
    },
    {
      key: 'og:description',
      tag: 'meta',
      attributes: {
        property: 'og:description',
        content: pathDescription(ogMeta?.description),
      },
    },
    {
      key: 'og:url',
      tag: 'meta',
      attributes: {
        property: 'og:url',
        content: pathUrl(ogMeta?.url),
      },
    },
    {
      key: 'og:image',
      tag: 'meta',
      attributes: {
        property: 'og:image',
        content: pathImage(ogMeta?.image?.data?.attributes?.url),
      },
    },
    {
      key: 'og:type',
      tag: 'meta',
      attributes: { name: 'og:type', property: 'og:type', content: ogMeta?.type },
    },
    {
      key: 'twitter:title',
      tag: 'meta',
      attributes: {
        property: 'twitter:title',
        content: pathTitle(socialNetworkMeta?.title),
      },
    },
    {
      key: 'twitter:description',
      tag: 'meta',
      attributes: {
        property: 'twitter:description',
        content: pathDescription(socialNetworkMeta?.description),
      },
    },
    {
      key: 'twitter:image',
      tag: 'meta',
      attributes: {
        property: 'twitter:image',
        content: pathImage(socialNetworkMeta?.image?.data?.attributes?.url),
      },
    },
    {
      key: 'twitter:url',
      tag: 'meta',
      attributes: {
        property: 'twitter:url',
        content: pathUrl(socialNetworkMeta?.url),
      },
    },
    {
      key: 'twitter:card',
      tag: 'meta',
      attributes: {
        property: 'twitter:card',
        content: socialNetworkMeta?.card,
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
