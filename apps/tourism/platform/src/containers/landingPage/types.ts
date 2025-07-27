import { ReactNode } from 'react';
import { TTabsData } from 'components/tabs/types';
import { FieldValues, UseFormGetValues, UseFormWatch } from 'react-hook-form';
import { TFlightContentsImage, TFlightContentsTabs } from 'services/domestic/flight/interface';
import { PaymentMethod } from 'utils/static/paymentType';
import { StaticImageData } from 'next/image';
import { SeoMetaRes } from 'components/seoMeta/types';

export interface City {
  intro: CityInfo;
  info: CityInfo[];
  attractions: CityInfo[];
}
export interface CityInfo {
  title: string;
  description: string;
  image?: StaticImageData;
}
export interface Service {
  title: string;
  description: string;
  image: StaticImageData;
}

export interface Faq {
  title: string;
  description: string;
}

export interface UserQuid {
  title: string;
  description: string;
}

export interface IFooterMenu {
  title: string;
  subMenu: Array<IFooterSubMenu>;
}

export interface IAppDownloadBtn {
  id?: number;
  title: string;
  src: unknown;
  link?: string;
}

export interface IDownloadInformation {
  title: string;
  downloadBtns: Array<IAppDownloadBtn>;
}

export interface IFooterSubMenu {
  title: string;
  link: string;
}

export interface IBlog {
  title: string;
  src?: StaticImageData;
  description: string;
  path?: string;
}

export interface IMagazine {
  title: string;
  src?: StaticImageData;
  description: string;
  path?: string;
}

export interface ICompany {
  title: string;
  icon?: unknown;
  path?: string;
  lastMod?: string;
}

export interface IRoute {
  id?: string | undefined;
  title?: string;
  href?: string;
  content?: {
    title: { body: ReactNode };
    description: { body: ReactNode };
  };
  hide?: boolean;
  originFarsiName?: string;
  destinationFarsiName?: string;
}
export interface IBusyRoute {
  title: string;
  src?: StaticImageData;
  routes: Array<IRoute>;
}

export interface IBusyRoute {
  title: string;
  src?: StaticImageData;
  routes: Array<IRoute>;
}

export interface IFaqContent {
  answer_text: string;
  question: string;
  id: number;
}
export interface IResponseBusyRoute {
  id: number;
  attributes: {
    title: string;
    destination_id: string;
    origin_id: string;
    description?: string;
    keyword: string;
    og_title: string;
    og_description: string;
    og_image: string;
    faq: Array<IFaqContent>;
    meta_seo: SeoMetaRes;
    content: string;
    short_content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ITabbedArticle {
  title: ReactNode;
  content: string;
  body: ReactNode;
  image: StaticImageData;
  tabs: TTabsData;
}

export type DescriptionType = 'rtl' | 'ltr';
export enum OperatingSystem {
  Windows = 'WINDOWS',
  Mac_OS = 'MAC OS',
  iOS = 'IOS',
  Android = 'ANDROID',
  Linux = 'LINUX',
  Unknown = 'UNKNOWNS',
  Web = 'Web',
}
export type TSubImageFormatTour = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string;
  size: number;
  width: number;
  height: number;
};
export type TImageFormatTour = {
  large: TSubImageFormatTour;
  small: TSubImageFormatTour;
  medium: TSubImageFormatTour;
  thumbnail: TSubImageFormatTour;
};

export type TImageTourDetails = {
  id: number;
  attributes: {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: TImageFormatTour;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    createdAt: string;
    updatedAt: string;
  };
};
export type TImageTour = {
  data: TImageTourDetails;
};
export type TTourProgram = {
  data: [
    {
      id: number;
      attributes: {
        is_one_day: boolean;
        code: string;
        hotel_name: string;
        adult_price: string;
        adult_price_single: string;
        adult_price_dollar: string;
        adult_price_single_dollar: string;
        kids_price: string;
        kids_price_without_bed: string;
        kids_price_dollar: string;
        kids_price_dollar_without_bed: string;
        baby_price: string;
        baby_price_dollar: string;
        additional_service_price: string;
        additional_service_price_dollar: string;
        capacity: number;
        type: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        from_date: string;
        to_date: string;
        number_night: string;
        status: boolean;
        travel_type: string;
        number_day: number;
      };
    },
  ];
};

export type TTourProgramDataItem = {
  id: number;
  attributes: {
    code: string;
    hotel_name: string;
    adult_price: string;
    adult_price_single?: string;
    adult_price_dollar?: string;
    adult_price_single_dollar?: string;
    kids_price: string;
    kids_price_without_bed?: string;
    kids_price_dollar?: string;
    kids_price_dollar_without_bed?: string;
    baby_price: string;
    baby_price_dollar: string;
    additional_service_price?: string;
    additional_service_price_dollar?: string;
    capacity: number;
    type: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    from_date: string;
    to_date: string;
    number_night: string;
    status: boolean;
    travel_type: string;
    number_day: number;
    is_one_day: boolean;
  };
};

export type TTourContent = {
  id: number;
  attributes: {
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    tour_content: string;
    short_description: string;
    attractions: string;
    type: string;
    sort_key: number;
    status: boolean;
    tour_service: string;
    tour_programs: TTourProgram;
    image: TImageTour;
    attractions_images: { data: TImageTourDetails[] };
    card_image: TImageTour;
    is_one_day: boolean;
    program_information: string;
    city: TCityTour;
    meta_seo: SeoMetaRes;
  };
};

export type TTourLandingContent = {
  service: {
    data: {
      id: number;
      attributes: {
        is_one_day: boolean;
        slug: string;
        type: string;
        title: string;
        description: string;
        tabs: TFlightContentsTabs;
        more_content: string;
        meta_seo: SeoMetaRes;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        cover: TFlightContentsImage | undefined;
        faq: {
          id: number;
          question: string;
          answer_text: string;
        }[];
        content: {
          data: {
            id: number;
            attributes: {
              title: string;
              content: string;
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
              cover: {
                data: {
                  attributes: {
                    formats: {
                      large: {
                        url: string;
                        width: string;
                        height: string;
                      };
                    };
                  };
                };
              };
            };
          }[];
        };
      };
    }[];
  };
};

export type TCounselingData = {
  title: string;
  slug: string;
  type: string;
};

export type TTourTableContent = {
  id: 0;
  tour_title: string;
  attributes: {
    code: string;
    hotel_name: string;
    from_date: string;
    to_date: string;
    adult_price: string;
    kids_price: string;
    baby_price: string;
    additional_service_price: string;
    capacity: number;
    type: string;
    number_night: string;
    status: true;
    city: { data: { attributes: { name_fa: string; name_en: string }; id: number } };
    travel_type: string;
    number_day: 0;
    adult_price_dollar?: string;
    kids_price_dollar?: string;
    baby_price_dollar: string;
    additional_service_price_dollar?: string;
    adult_price_single: string;
    kids_price_without_bed: string;
    adult_price_single_dollar: string;
    kids_price_dollar_without_bed: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    createdBy: string;
    updatedBy: string;
    is_one_day: boolean;
  };
};

export type TTourOrderReq = {
  service: {
    data: {
      tour: TTourTableContent;
    };
  };
};

export type TRowObject = {
  'نوع مسافر': string;
  'تعداد مسافر': string;
  'قیمت هر نفر': string;
  'مجموع قیمت': string;
};
export type TTourOrderInvoice = {
  data: TTourTableContent['attributes'];
  getValues: UseFormGetValues<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export type TCityTour = {
  data: {
    id: number;
    attributes: {
      name_fa: string;
      name_en: string;
      city_code: string | null;
      createdAt: string; // Consider using Date type if it's always in ISO format
      updatedAt: string; // Consider using Date type if it's always in ISO format
      publishedAt: string; // Consider using Date type if it's always in ISO format
    };
  };
};

export type TProgramItem = {
  id: number;
  attributes: {
    code: string;
    hotel_name: string;
    adult_price: string;
    adult_price_dollar: string;
    kids_price: string;
    kids_price_dollar: string;
    baby_price: string;
    baby_price_dollar: string;
    additional_service_price: string;
    additional_service_price_dollar: string;
    capacity: number;
    type: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    from_date: string;
    to_date: string;
    number_night: string;
    status: boolean;
    travel_type: string;
    number_day: number;
  };
};

export type TTourPaymentInfo = {
  attributes: TTourTableContent;
  paymentType: PaymentMethod | string;
  quantity: number;
  totalPrice: number;
  tourId: string;
};
