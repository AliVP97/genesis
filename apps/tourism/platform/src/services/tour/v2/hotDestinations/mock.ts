import { MOCK_CITIES } from '../mock';

export const MOCK_HOT_DESTINATIONS_FUNCTION = () => {
  return Promise.resolve(MOCK_CITIES.slice(0, 3));
};
