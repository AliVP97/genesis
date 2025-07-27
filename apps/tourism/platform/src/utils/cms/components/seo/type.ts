import { HTMLAttributes, LinkHTMLAttributes, MetaHTMLAttributes, ReactNode } from 'react';

type Image = {
  url: string;
};

export type TProps = {
  metaData?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    follow?: boolean;
    index?: boolean;
    metaOgSocial?: MetaOgSocial;
    twitter?: MetaSocial;
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
  image: Image;
  title: string;
  url: string;
};

type MetaOgSocial = {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string;
  image: { url: string };
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

type Twitter = {
  id: number;
  title: string;
  description: string;
  url: string;
  card: string;
  image: { url: string };
};

type StructuredData = Record<string, string>;

export type MetaSeoProps = {
  metaData?: {
    title?: string;
    description?: string;
    keywords?: string;
    robots?: string;
    structuredData?: StructuredData;
    viewport?: string;
    canonicalUrl?: string;
    index?: boolean;
    follow?: boolean;
    metaOgSocial?: MetaOgSocial;
    twitter?: Twitter;
  };
};
