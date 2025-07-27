export type SupportBodyProps = {
  description?: string;
  contactMethods?: {
    id: number;
    icon: { url: string };
    title: string;
    link: string;
    linkText: string;
  }[];
};
