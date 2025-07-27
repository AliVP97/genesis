import request from 'services/axios';
import { IHotelsSimilarPayload, THotelSimilars } from '../interface';
import API from 'utils/routes/api';
export const getSimilarHotels = async (similarHotelPayload: IHotelsSimilarPayload) => {
  const { data }: { data: THotelSimilars } = await request.get(
    API.HOTEL.GET_SIMILAR_HOTELS +
      `/${similarHotelPayload.requestId}/${similarHotelPayload.hotelId}/similar`,
  );
  return data;
};
