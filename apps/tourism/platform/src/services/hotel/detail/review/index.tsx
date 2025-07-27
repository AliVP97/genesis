import request from 'services/axios';
import { definitions } from 'types/hotel';
import API from 'utils/routes/api';
export type HotelReview = {
  hotelId: string;
  requestId: string;
};
export type Review = definitions['apihotelReviewDetail'][];
export const hotelReviews = async ({ hotelId, requestId }: HotelReview) => {
  const { data }: { data: { reviews: Review } } = await request.post(
    API.HOTEL.REVIEW + `/${requestId}/${hotelId}`,
  );
  return data.reviews;
};
