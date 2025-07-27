import request from 'services/axios';
import { definitions } from 'types/hotel';
import API from 'utils/routes/api';
export type Review = definitions['hotelCheckReviewResponse'];
type ReviewRatePayload = definitions['HotelApplyReviewBody'];
export const gethotelComment = async (orderId: string) => {
  const { data }: { data: Review } = await request.get(API.HOTEL.GET_COMMENT(orderId));
  return data;
};
export const addHotelComment = async (orderId: string, payload: ReviewRatePayload) => {
  const { data }: { data: Review } = await request.post(API.HOTEL.ADD_COMMENT(orderId), {
    ...payload,
  });
  return data;
};
