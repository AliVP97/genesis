export type PrepositionItemProps = {
  title?: string;
  body?: string;
  image?: {
    url: string;
  };
};

export type PrepositionProps = {
  items?: Array<PrepositionItemProps>;
};
