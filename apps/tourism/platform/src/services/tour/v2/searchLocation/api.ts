import API from 'utils/routes/api';
import { TTourv1SearchZoneResponse } from './types';
import request from '../../../axios';

export const getLocations = async (tourType: string, locationType: string, cityName: string) => {
  const { data }: { data: TTourv1SearchZoneResponse } = await request.get(
    API.TOUR.GET_CITIES + `/${tourType}/${locationType}/search/${cityName}`,
  );
  return data;
};
