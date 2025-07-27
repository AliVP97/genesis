import { IResponseBusyRoute } from 'containers/landingPage/types';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement } from 'react';
import FAQ from 'containers/landingPage/components/faq';
import { stationLatinToFarsi as trainStationLatinToFarsi } from '../trainStatic';
import { stationLatinToFarsi as busStationLatinToFarsi } from '../bus';

import { BusyRoutesDescription } from 'containers/landingPage/components/busyRoutes/busyRouteDescription';
import { flightDetails, flightFaqGenerator } from './flights';
import { trainDetails, trainFaqGenerator } from './train';
import { iataToFarsi } from '../flightStatics';
import {
  iataToFarsiCity,
  iataToFarsi as iataToFarsiInternationalCity,
} from '../internationalFlight';
import {
  ServiceFaqStaticModel,
  ServiceStaticModel,
  StaticMetaDataProps,
  TranslatorModel,
  TranslatorProps,
} from './types';
import { mapSeoData } from 'components/seoMeta/helpers/mapSeoData';
import { SeoMeta } from 'components/seoMeta';
import { busDetails, busFaqGenerator } from './bus';
import { breadCrumbGenerator } from 'components/breadcrumb/utils';
import { GetServerSidePropsContext, PreviewData } from 'next';

export const iataCodeToFarsiTranslator = ({ iata, serviceName }: TranslatorProps) => {
  const domesticAndInternationalIata = Object.assign(
    {},
    iataToFarsi,
    iataToFarsiInternationalCity,
    iataToFarsiCity,
  );
  const translator: TranslatorModel = {
    flights: domesticAndInternationalIata[iata ?? ''],
    international: domesticAndInternationalIata[iata ?? ''],
    train: iata ? trainStationLatinToFarsi[iata] : '',
    bus: iata ? busStationLatinToFarsi[iata]?.split('-')[0] : '',
  };
  return translator[serviceName] ?? '';
};
export const localContentsGenerator = ({
  origin,
  destination,
  serviceName,
}: StaticMetaDataProps) => {
  const text = `${iataCodeToFarsiTranslator({
    iata: origin,
    serviceName,
  })} ${iataCodeToFarsiTranslator({ iata: destination, serviceName })}`;
  const servicesFaqData: ServiceFaqStaticModel = {
    bus: () => busFaqGenerator(text),
    train: () => trainFaqGenerator(text),
    flights: () => flightFaqGenerator(text),
    international: () => flightFaqGenerator(text),
  };

  const servicesBusyData: ServiceStaticModel = {
    bus: () => busDetails(text),
    train: () => trainDetails(text),
    flights: () => flightDetails(text),
    international: () => flightDetails(text),
  };
  return {
    content: servicesBusyData[serviceName],
    faq: servicesFaqData[serviceName],
  };
};

export const LoadSearchResultContent = (
  query: ParsedUrlQuery,
  content: IResponseBusyRoute,
  serviceName: string,
): ReactElement => {
  const origin = (query?.id as string)?.split('-')[0];
  const destination = (query?.id as string)?.split('-')[1];

  let localContent;
  if (origin || destination) {
    localContent = localContentsGenerator({
      origin,
      destination,
      serviceName,
    }).content();
  }

  const seoData = content?.attributes?.meta_seo;

  const { metaData } = mapSeoData(seoData);

  return (
    <>
      <SeoMeta metaData={metaData} />
      <BusyRoutesDescription localContent={localContent} cmsContent={content} />
    </>
  );
};

export const LoadSearchResultFaqContent = (
  query: ParsedUrlQuery,
  content: IResponseBusyRoute,
  serviceName: string,
): ReactElement => {
  try {
    const origin = (query?.id as string)?.split('-')[0];
    const destination = (query?.id as string)?.split('-')[1];
    const faqContent = content?.attributes?.faq?.length
      ? content.attributes.faq.map((obj) => obj)
      : localContentsGenerator({
          serviceName,
          origin,
          destination,
        })
          .faq()
          .map((obj) => obj);
    return (
      <div className="my-4">
        <FAQ faqs={faqContent} />
      </div>
    );
  } catch (error) {
    return <></>;
  }
};

export const serverSideBreadCrumbGenerator = (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  cityName?: string,
  hotelName?: string,
) => {
  const { req } = context;
  const host = req.headers.host;
  const fullUrl = `${host}/tourism${context.resolvedUrl}`;
  const breadCrumbGeneratorObject = breadCrumbGenerator(
    fullUrl || '',
    context.query as ParsedUrlQuery,
    cityName,
    hotelName,
  );

  return { breadCrumb: breadCrumbGeneratorObject.breadCrumb, path: fullUrl };
};
