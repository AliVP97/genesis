import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { ticketsFilterStateToQuery } from 'containers/ticketsFilter/utils';
import { useRouter } from 'next/router';
import { queryToQueryString, QueryType } from 'utils/helpers/global';
import getQueryWithoutFilterKeys from '../helpers/getQueryWithoutFilterKeys';

export const useCreateQueryAndPush = () => {
  const { push } = useRouter();
  const createQueryAndPush = (query: QueryType, ticketsFilterState: TicketsFilterStateType) => {
    void push(
      {
        pathname: `/international/` + query?.id,
        query: queryToQueryString({
          ...getQueryWithoutFilterKeys(query),
          ...ticketsFilterStateToQuery(ticketsFilterState),
        } as QueryType),
      },
      undefined,
      { shallow: true },
    );
  };
  return {
    createQueryAndPush,
  };
};
