import request from 'services/axios';
import { QueryFunctionContext } from 'react-query';
import API from 'utils/routes/api';
import { THotelInfo, THotelsAndCitiesResponse } from './interface';

export const getCitiesAndHotels = async (ctx: QueryFunctionContext) => {
  const { data }: { data: THotelsAndCitiesResponse } = await request.get(
    `${API.HOTEL.GET_CITIES_AND_HOTELS}?name=${(ctx.queryKey[1] as { query: string })?.query}`,
  );
  return data;
};

export const getCitiesAndHotels_MOC = async () => {
  return Promise.resolve({
    city: [
      { cityId: 'b0', name: 'بوداپست', province: 'مجارستان' },
      { cityId: 'b1', name: 'متروسیتی', province: 'یه جایی' },
      { cityId: 'b1', name: 'شهر موش ها', province: 'آفریقا' },
      { cityId: 'b1', name: 'گرگان', province: 'گلستان' },
    ],
    hotels: [
      {
        name: 'ترانسیلوانیا',
        hotelId: '01',
        city: { cityId: 'b0', name: 'بوداپست', province: 'مجارستان' },
      },
      {
        name: 'قصر لرد فارکوعات',
        hotelId: '02',
        city: { cityId: 'b1', name: 'شهر موش ها', province: 'آفریقا' },
      },
      {
        name: 'اقامتگاه جنگلی مادربزرگ شنل قرمزی',
        hotelId: '03',
        city: { cityId: 'b1', name: 'گرگان', province: 'گلستان' },
      },
      {
        name: 'فاضلاب لاکپشتای نینجا',
        hotelId: '04',
        city: { cityId: 'b1', name: 'متروسیتی', province: 'یه جایی' },
      },
    ],
  });
};

export const getBusiestTransportServiceProviders = async () => {
  const { data }: { data: THotelsAndCitiesResponse } = await request.get(
    API.HOTEL.GET_FREQUENT_TARGETS,
  );
  return data;
};

export const getHotelInfo = async (requestId: string, hotelId: string) => {
  const { data }: { data: THotelInfo } = await request.get(
    API.HOTEL.GET_HOTELS + `/${requestId}/${hotelId}`,
  );
  return data;
};

export const getHotelInfoServerSide = async (requestId: string, hotelId: string) => {
  const { data }: { data: THotelInfo } = await request.get(
    API.HOTEL.GET_HOTELS_SERVERSIDE + `/${requestId}/${hotelId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_HOTEL_URL,
      headers: {
        Authorization: 'bjxKjgEC7aEz1umn',
      },
    },
  );
  return data;
};
