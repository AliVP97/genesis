export type MagItemProps = {
  title?: string;
  body?: string;
  link?: string;
  imageAlt?: string;
  image?: {
    url: string;
  };
};

export type MagProps = {
  title?: string;
  items?: Array<MagItemProps>;
};
