export type RichTextPropsType = {
  title?: string;
  body?: string;
  image?: { url: string; formats?: { thumbnail: { url: string } } };
  summary?: string;
  expandable?: boolean;
  imagePosition?: string;
};
