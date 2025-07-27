import { TicketsFilterStateType } from 'containers/ticketsFilter/types';
import { ticketsFilterStateToQuery } from 'containers/ticketsFilter/utils';
import { useRouter } from 'next/router';
import { queryToQueryString, QueryType } from 'utils/helpers/global';
import { totalSelectedFilters } from 'containers/ticketsFilter/utils';

export const useCreateQueryAndPush = () => {
  const { push } = useRouter();
  const createQueryAndPush = (query: QueryType, ticketsFilterState: TicketsFilterStateType) => {
    void push(
      {
        pathname: `/bus/` + query?.id,
        query: queryToQueryString({
          ...query,
          selectability: totalSelectedFilters(ticketsFilterState) === 0 ? undefined : 'selectable',
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
