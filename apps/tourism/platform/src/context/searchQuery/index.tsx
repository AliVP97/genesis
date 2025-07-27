import { createContext, ReactNode, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';

const initialState = {
  queryState: {},
};
interface searchQueryInterface {
  queryState: ParsedUrlQuery;
}

export const SearchQuery = createContext<searchQueryInterface>(initialState);

export const SearchQueryProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(initialState);
  const setQueryState = (query: ParsedUrlQuery) => {
    setState({
      queryState: query,
    });
  };
  return (
    <SearchQuery.Provider
      value={{
        queryState: state.queryState,
        // @ts-ignore
        setQueryState,
      }}
    >
      {children}
    </SearchQuery.Provider>
  );
};
