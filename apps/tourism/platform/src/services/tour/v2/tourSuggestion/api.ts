import API from 'utils/routes/api';
import { TTourTripSuggestionsResponse } from './types';
import request from '../../../axios';

export const getTourSuggestion = async () => {
  const { data }: { data: TTourTripSuggestionsResponse } = await request.get(
    API.TOUR.GET_SUGGESTION,
  );
  return data;
};
