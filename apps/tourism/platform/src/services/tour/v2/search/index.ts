import request from 'services/axios';
import API from 'utils/routes/api';
import { definitions } from 'types/tour';

export const searchItems = async (filters: definitions['tourSearchRequest']) => {
  const { data }: { data: definitions['tourSearchResponse'] } = await request.post(
    API.TOUR.GET_SEARCH_ITEMS,
    filters,
  );
  return data;
};
