import axios from 'axios';
import { IResponseBusyRoute } from './interface';
import API from 'utils/routes/api';

export const getTrainLandingContent = async (query_id: string) => {
  const routeId = (query_id as string)?.split('-');
  const url = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}api/seo-contents?filters[origin_id][$eq]=${
    routeId[0]
  }&filters[destination_id][$eq]=${[
    routeId[1],
  ]}&populate=faq,meta_seo.twitter.image,meta_seo.metaOgSocial.image&filters[service][$eq]=train`;
  const { data }: { data: IResponseBusyRoute } = await axios.get(url);

  return data;
};

export const getTrainSinglePageLandingContents = async (city_name: string) => {
  const { data }: { data: IResponseBusyRoute } = await axios.get(
    `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${API.CMS.GET_TRAIN_SINGLE_PAGE_CONTENTS}${city_name}`,
  );
  return data;
};
