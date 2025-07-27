import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { IataType, SearchQuery } from './types';

type UseIataCodes = () => {
  originIata: string;
  originType: IataType;
  destinationIata: string;
  destinationType: IataType;
};

/**
 * Get the id from the router query this id can be defined in url params or in
 * the url search params.
 */
const useIataCodes: UseIataCodes = () => {
  const query = useRouter().query as SearchQuery;

  return useMemo(() => {
    const { id, originType, destinationType } = query;
    const result = id.split('-');

    return {
      originType,
      destinationType,
      originIata: result[0],
      destinationIata: result[1],
    };
  }, [query]);
};

export default useIataCodes;
