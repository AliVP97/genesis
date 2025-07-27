export type VisaConditionsItemProps = {
  title: string;
  description: string;
  image: {
    url: string;
  };
};

export type VisaConditionsProps = {
  title?: string;
  description?: string;
  items?: Array<VisaConditionsItemProps>;
  info?: {
    title: string;
    content: string;
  };
};
