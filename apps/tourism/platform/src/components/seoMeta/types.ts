import { HTMLAttributes, LinkHTMLAttributes, MetaHTMLAttributes, ReactNode } from 'react';
import { TFlightContentsImage } from 'services/domestic/flight/interface';

export type TProps = {
  metaData?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    follow?: boolean;
    index?: boolean;
    ogMeta?: MetaOgSocial;
    socialNetworkMeta?: MetaSocial;
  };
  children?: ReactNode;
};

export interface TServices {
  flights: string;
  train: string;
  bus: string;
  international: string;
  [key: string]: string;
}

export type MetaTag =
  | {
      key: string;
      tag: 'meta';
      attributes: MetaHTMLAttributes<HTMLMetaElement>;
    }
  | {
      key: string;
      tag: 'link';
      attributes: LinkHTMLAttributes<HTMLLinkElement>;
    }
  | {
      key: string;
      tag: 'title';
      attributes: HTMLAttributes<HTMLTitleElement>;
    };

export type MetaTagsProps = {
  pathTitle?: string;
  pathDescription?: string;
  pathKeywords?: string;
  canonicalWithoutEndingSlash?: string;
  pathURL?: string;
  robotsContent?: string;
};

export type MetaSocial = {
  card: string;
  description: string;
  id: number;
  image: TFlightContentsImage;
  title: string;
  url: string;
};

export type MetaOgSocial = {
  description: string;
  id: number;
  image: TFlightContentsImage;
  title: string;
  type: string;
  url: string;
};

export type SeoMetaRes = {
  canonicalURL: string;
  follow: boolean;
  id: number;
  index: boolean;
  keywords: string;
  metaDescription: string;
  metaOgSocial: MetaOgSocial;
  metaRobots: string;
  metaTitle: string;
  metaViewport: string;
  slug: string;
  structuredData: string;
  twitter: MetaSocial;
};
