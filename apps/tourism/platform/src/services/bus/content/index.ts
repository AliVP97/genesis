import axios from 'axios';
import { IResponseBusyRoute } from './interface';

export const getBusLandingContent = async (query_id: string) => {
  const routeId = (query_id as string)?.split('-');
  const url = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}api/seo-contents?filters[origin_id][$eq]=${
    routeId[0]
  }&filters[destination_id][$eq]=${[
    routeId[1],
  ]}&populate=faq,meta_seo.twitter.image,meta_seo.metaOgSocial.image&filters[service][$eq]=bus`;
  const { data }: { data: IResponseBusyRoute } = await axios.get(url);
  return data;
};
