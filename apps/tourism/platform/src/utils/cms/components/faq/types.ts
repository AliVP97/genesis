type FaqItem = {
  title: string;
  body: string;
};

export type CmsFaqProps = {
  title?: string;
  items?: Array<FaqItem>;
};
