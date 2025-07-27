import { SeoMetaRes } from 'components/seoMeta/types';

export interface IResponseBusyRoute {
  data: {
    id: number;
    attributes: {
      title: string;
      destination_id: string;
      origin_id: string;
      description: string;
      meta_seo: SeoMetaRes;
      short_content: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      faq: string;
    };
  }[];
}
