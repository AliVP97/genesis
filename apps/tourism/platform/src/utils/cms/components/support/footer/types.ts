export type SupportFooterProps = {
  buttonList?: {
    id: number;
    title: string;
    icon: { url: string };
    link: string;
    caption: string;
    type: 'primary' | 'scondary';
  }[];
};
