export type VisaPageHeroItemsProps = {
  title?: string;
  description?: string;
  image?: {
    url: string;
  };
};

export type VisaPageHeroProps = {
  title?: string;
  cover?: {
    url: string;
  };
  flag?: {
    url: string;
  };
  items?: Array<VisaPageHeroItemsProps>;
};
