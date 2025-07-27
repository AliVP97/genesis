import { originalPlatform } from 'utils/helpers/originalPlatform';
import {
  TPayloadOrderVisa,
  // VisaContent,
  VisaFaq,
  VisaLandingContent,
} from './interface';
import request from 'services/axios';

export const getVisaContent = async (name: string) => {
  const url = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}api/visa-${name}?populate=price_information.image,pre_Instruction.image,visa_need_process.process,visa_need_process.info,visa_document,cover,flag_image,process,validity,visa_need_document,visa_need_document.process,meta_seo,meta_seo.metaOgSocial.image,meta_seo.twitter.image,meta_seo.metaOgSocial,faq`;
  const { data }: { data: VisaFaq } = await request.get(url);
  return data;
};

export const getVisaLandingContent = async () => {
  const url = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}api/visa?populate=conditions.conditions,meta_seo.metaOgSocial.image,visa_issuance.image,sevices,services.background_image,services.flag_image,explanation.image,price.image,additional_content,cover,meta_seo.twitter.image,faq`;
  const { data }: { data: VisaLandingContent } = await request.get(url);
  return data;
};

export const orderVisa = async (payload: TPayloadOrderVisa) => {
  const { data } = await request.post(`${process.env.NEXT_PUBLIC_VISA_API}create`, payload, {
    headers: {
      'Grpc-metadata-Original-Platform': originalPlatform(),
    },
  });
  return data;
};

export const faqVisa = async (country: string | string[] | undefined) => {
  const url = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}api/visa-${country}?populate=conditions.conditions,meta_seo.metaOgSocial.image,visa_issuance.image,sevices,services.background_image,services.flag_image,explanation.image,price.image,additional_content,cover,meta_seo.twitter.image,faq`;
  const { data }: { data: VisaFaq } = await request.get(url);
  return data;
};
