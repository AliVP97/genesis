import { MOCK_CITIES } from '../mock';
import { TBody, TPayload } from './types';

export const MOCK_SEARCH_FUNCTION = (arg: TPayload): Promise<TBody> => {
  return Promise.resolve(
    MOCK_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(arg.query.toLowerCase()) || city.id.includes(arg.query),
    ),
  );
};
