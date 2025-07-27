export type TTourismLandingContentsImage = {
  data: {
    attributes: {
      url: string;
      formats: {
        thumbnail: {
          url: string;
          name: string;
          hash: string;
          width: number | string;
          height: number | string;
        };
        small: {
          url: string;
          name: string;
          hash: string;
          width: number | string;
          height: number | string;
        };
      };
    };
  };
};

export type TTourismLandingContentsTabs = {
  title: string;
  description: string;
}[];

export interface TTourismLandingContentMoreInfo {
  data?: {
    attributes?: {
      title?: string;
      content?: string;
      short_content?: string;
      cover?: TTourismLandingContentsImage;
    };
  };
}

export type TTourismLandingContentsFaqs = {
  data?: {
    attributes: {
      question: string;
      answer_text: string;
    };
  };
};

export interface TTourismLandingContents {
  data: {
    attributes: {
      title: string;
      description: string;
      cover: TTourismLandingContentsImage;
      tabs?: TTourismLandingContentsTabs;
      faqs?: TTourismLandingContentsFaqs;
      more_info?: TTourismLandingContentMoreInfo;
    };
  }[];
}
