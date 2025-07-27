import { SeoMetaRes } from 'components/seoMeta/types';

export interface TPayloadOrderVisa {
  first_name: string;
  last_name: string;
  email: string;
  rrn?: string;
  passport_no: string;
  mobile_number?: string;
  passport_exp: string;
  renewal_visa: number;
  staying_time: string;
  visa_type: 'single' | 'multi';
  service_type: string;
  visa_name: string;
  number_adults: number;
  number_minors: number;
  number_babies: number;
}

type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

type ImageUrl = {
  data: {
    id: number;
    attributes: {
      name: string;
      width: number;
      height: number;
      formats: {
        small?: ImageFormat;
        medium?: ImageFormat;
        large?: ImageFormat;
        thumbnail?: ImageFormat;
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type VisaLandingContent = {
  data: {
    id: number;
    attributes: {
      caption: string;
      type_contents: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      conditions: {
        id: number;
        title: string;
        caption: string;
        conditions: {
          id: number;
          title: string;
        }[];
      };
      additional_content: string;
      explanation: {
        id: number;
        title: string;
        content: string;
        image: ImageUrl;
      };
      price: {
        id: number;
        title: string;
        content: string;
        image: ImageUrl;
      };
      meta_seo: SeoMetaRes;
      visa_issuance: {
        id: number;
        title: string;
        content: string;
        caption: string;
        image: ImageUrl;
      };
      cover: ImageUrl;
      services: {
        id: number;
        title: string;
        path: string;
        flag_image: ImageUrl;
        background_image: ImageUrl;
      }[];
      faq: {
        answer_text: string;
        question: string;
        id: number;
      }[];
    };
  };
} | null;

export type VisaFaq = {
  data: {
    question: string;
    answer_text: string;
    title?: string;
  }[];
};

export type VisaContent = {
  data: {
    id: number;
    attributes: {
      content: string;
      title: string;
      type_contents: string;
      caption: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      info: string;
      faq: {
        question: string;
        answer_text: string;
        title?: string;
      }[];
      price_information: {
        id: number;
        content: string;
        image: ImageUrl;
        title: string;
      };
      validity: {
        id: number;
        title: string;
        caption: string;
      };
      process: {
        id: number;
        title: string;
        caption: string;
      };
      meta_seo: SeoMetaRes;
      pre_Instruction: {
        id: number;
        title: string;
        content: string;
        image: ImageUrl;
      };
      visa_need_process: {
        id: number;
        title: string;
        info: {
          id: number;
          title: string;
          content: string;
        };
        process: {
          id: number;
          title: string;
          caption: string;
        }[];
      };
      visa_need_document: {
        id: number;
        title: string;
        process: {
          id: number;
          title: string;
          caption: string;
        }[];
      };
      cover: ImageUrl;
      flag_image: ImageUrl;
    };
  };
} | null;

export type visaContentType = {
  visaContent: NonNullable<VisaContent>['data'];
};

export type VisaLandingContentType = {
  content: NonNullable<VisaLandingContent>['data'];
};

type PageDataType = VisaLandingContentType['content']['attributes'];

export type PageContentData = {
  data: {
    explanation: PageDataType['explanation'];
    typeContent: PageDataType['type_contents'];
    price: PageDataType['price'];
    issuance: PageDataType['visa_issuance'];
    additionalContent: PageDataType['additional_content'];
    caption: PageDataType['caption'];
    faq: PageDataType['faq'];
  };
};
