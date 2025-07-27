import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { ticketsFilterStateToQuery } from 'containers/ticketsFilter/utils';
import { useRouter } from 'next/router';
import { queryToQueryString, QueryType } from 'utils/helpers/global';

export const useCreateQueryAndPush = () => {
  const { push } = useRouter();
  const createQueryAndPush = (query: QueryType, ticketsFilterState: TicketsFilterStateType) => {
    void push(
      {
        pathname: `/hotel/` + query?.id,
        query: queryToQueryString({
          ...query,
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
