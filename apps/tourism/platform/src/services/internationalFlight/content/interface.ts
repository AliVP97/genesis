export interface IResponseBusyRoute {
  data: {
    id: number;
    attributes: {
      title: string;
      destination_id: string;
      origin_id: string;
      description: string;
      keyword: string;
      og_title: string;
      og_description: string;
      og_image: string;
      content: string;
      short_content: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }[];
}
