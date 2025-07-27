import request from 'services/axios';

import API from 'utils/routes/api';

interface DataItem {
  id: string;
  eventId: string;
  image: string;
  type: string;
  status: string;
  link: string;
}

interface ResponseData {
  data: DataItem[];
}

export const getPromotionSlider = async () => {
  const { data }: { data: ResponseData } = await request.get(API.TOUR.GET_PROMOTION_SLIDER, {
    headers: { 'Grpc-Metadata-Device-Id': 'Device', 'Grpc-metadata-Platform': 'WEBSITE' },
  });
  return data;
};
