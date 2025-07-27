import request from 'services/axios';
import API from 'utils/routes/api';

export const getHotelPassengerConfig = async () => {
  const { data }: { data: IPassengersHotelConfig } = await request.get(
    API.HOTEL.GET_PASSENGERS_CONFIG,
  );
  return data;
};
