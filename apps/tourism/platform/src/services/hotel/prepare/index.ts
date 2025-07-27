import request from 'services/axios';
import API from 'utils/routes/api';
import {
  TGetHotelSearchIdRequest,
  TGetHotelSearchIdResponse,
  TGetHotelsResponse,
} from './interface';

export const prepareHotel = async (query: TGetHotelSearchIdRequest) => {
  const { data }: { data: TGetHotelSearchIdResponse } = await request.post(API.HOTEL.GET_UUID, {
    ...query,
  });
  return data;
};

export const getHotelsList = async (requestId: string) => {
  const { data }: { data: TGetHotelsResponse } = await request.get(
    API.HOTEL.GET_HOTELS + `/${requestId}`,
  );
  /* // to test empty result:
  return {
    isFinished: true,
    list:[]
  } */
  return data;
};
