import { useContext } from 'react';
import { SearchQuery } from 'context/searchQuery';

export const useSearchQueryContext = () => {
  return useContext(SearchQuery);
};
