import request from 'services/axios';

type sliderData = {
  alt: string;
  link: string;
  sort_key: string;
  desktop_slider: string;
  mobile_slider: string;
};

export type slidersData = {
  service: {
    data: {
      sliders: [sliderData];
    };
  };
};

/**
 * @deprecated since tour version 2.0
 */

export const getTourLandingSlider = async () => {
  const { data }: { data: slidersData } = await request.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}tour-backend/api/v1/tour/slider`,
  );
  return data;
};
