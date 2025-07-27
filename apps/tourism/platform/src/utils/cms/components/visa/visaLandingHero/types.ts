export type VisaCardProps = {
  id?: number;
  title: string;
  flag: {
    url: string;
  };
  background: {
    url: string;
  };
  link: string;
};

export type VisaLandingHeroProps = {
  title?: string;
  cover?: {
    url: string;
  };
  visaCards?: Array<VisaCardProps>;
};
