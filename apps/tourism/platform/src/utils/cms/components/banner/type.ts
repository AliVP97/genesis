export type BannerProps = {
  title: string;
  link: string;
  action: string;
  bannerstatus: boolean;
  external: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  service: string;
};

export type ApiResponse = {
  data: BannerProps[];
};
